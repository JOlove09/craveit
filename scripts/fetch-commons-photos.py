"""Download appropriately licensed food photographs from Wikimedia Commons.
Run: python scripts/fetch-commons-photos.py
Requires: pip install requests pillow
Inspect resulting PHOTO_REVIEW.csv and public/image-credits.json before publishing.
"""
import csv, html, io, json, re, time
from pathlib import Path
from urllib.parse import quote
import requests
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'src/data/asianRecipes.json'
IMAGES=ROOT/'public/images'
RECIPES=json.loads(DATA.read_text(encoding='utf-8'))
SESSION=requests.Session()
SESSION.headers.update({'User-Agent':'CraveItStudentRecipeExplorer/1.0 (educational photo attribution; contact: https://commons.wikimedia.org)'})
API='https://commons.wikimedia.org/w/api.php'
ALLOWED=('cc-by-','cc-by-sa-','cc0','public domain','pd-')
credits=[]; review=[]; used=set(); done=0

def api(params):
    for retry in range(3):
        try:
            r=SESSION.get(API,params={'format':'json',**params},timeout=25)
            r.raise_for_status()
            return r.json()
        except requests.RequestException:
            if retry==2: raise
            time.sleep(2+retry*3)

def plain(s):return re.sub(r'<[^>]+>','',html.unescape(s or '')).strip()

def candidates(q):
    data=api({'action':'query','generator':'search','gsrsearch':f'filetype:bitmap {q}',
        'gsrnamespace':6,'gsrlimit':25,'prop':'imageinfo','iiprop':'url|extmetadata|size',
        'iiurlwidth':1000})
    return list(data.get('query',{}).get('pages',{}).values())

def score(title, meal):
    a=set(re.findall(r'[a-z]+',meal.lower()))-{'vegetable','chicken','rice','noodles','soup','fried','fresh'}
    b=set(re.findall(r'[a-z]+',title.lower()))
    return len(a&b)*5 + (4 if ' '.join(meal.lower().split()) in title.lower() else 0)

for item in RECIPES:
    meal=item['strMeal']; current=item.get('strMealThumb','')
    if current.lower().endswith(('.jpg','.jpeg','.png','.webp')) and (ROOT/'public'/current.lstrip('/')).exists():
        review.append([meal,'existing photo retained',current,''])
        continue
    print('Searching:',meal,flush=True)
    try:
        matches=[]
        for query in [meal, meal.replace('Vegetable ','').replace('Garlic ','')]:
            for p in candidates(query):
                info=(p.get('imageinfo') or [{}])[0]
                meta=info.get('extmetadata',{})
                lic=plain(meta.get('LicenseShortName',{}).get('value','')).lower()
                if not any(z in lic for z in ALLOWED):continue
                if not info.get('thumburl') or info.get('width',0)<500:continue
                title=p.get('title','')
                if title in used:continue
                matches.append((score(title,meal),title,info,meta,lic))
            if matches:break
        matches.sort(reverse=True,key=lambda x:x[0])
        if not matches or matches[0][0]<5:
            review.append([meal,'no sufficiently matching licensed photo',current,''])
            continue
        _,title,info,meta,lic=matches[0]
        r=SESSION.get(info['thumburl'],timeout=35);r.raise_for_status()
        img=Image.open(io.BytesIO(r.content)).convert('RGB')
        if min(img.size)<300:raise ValueError('image too small')
        filename='commons-'+re.sub('[^a-z0-9]+','-',meal.lower()).strip('-')+'.webp'
        img.thumbnail((1100,850));img.save(IMAGES/filename,'WEBP',quality=84,method=5)
        item['strMealThumb']='/images/'+filename
        used.add(title);done+=1
        credits.append({'recipe':meal,'file':filename,'commons_file':title,
          'source':'https://commons.wikimedia.org/wiki/'+quote(title.replace(' ','_'),safe=':/_'),
          'author':plain(meta.get('Artist',{}).get('value','')),
          'license':plain(meta.get('LicenseShortName',{}).get('value','')),
          'license_url':plain(meta.get('LicenseUrl',{}).get('value','')),
          'modification':'Resized and converted to WebP'})
        review.append([meal,'downloaded; visually review dish match','/images/'+filename,title])
        DATA.write_text(json.dumps(RECIPES,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        (ROOT/'public/image-credits.json').write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    except Exception as exc:
        review.append([meal,'ERROR: '+str(exc)[:120],current,''])
    time.sleep(0.4)
with (ROOT/'PHOTO_REVIEW.csv').open('w',newline='',encoding='utf-8') as f:
    w=csv.writer(f);w.writerow(['recipe','status','image','source_file']);w.writerows(review)
print(f'Finished: {done} newly downloaded; inspect PHOTO_REVIEW.csv for failures and mismatches.')
