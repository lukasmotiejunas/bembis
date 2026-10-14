"""Import verified supplier assets using the sheet's approved retail prices.

Input is the read-only Google Sheets export plus browser-observed product data.
Supplier cost data is not written into the public catalogue.
"""
import json
import re
import shutil
import sys
import unicodedata
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT/'.data/halloween-import/supplier-source.json'
records = json.loads(SOURCE.read_text())
labels = {'Marka':'Prekės ženklas','EAN (GTIN)':'EAN','Liczba sztuk w zestawie':'Kiekis rinkinyje',
          'Liczba sztuk w opakowaniu':'Kiekis pakuotėje','Pojemność':'Talpa','Materiał':'Medžiaga'}
values = {'plastik':'Plastikas','poliester':'Poliesteris','papier':'Popierius','guma':'Guma',
          'biały':'Balta','czarny':'Juoda','pomarańczowy':'Oranžinė','wielokolorowy':'Įvairiaspalvė'}
descriptions = {
 1:'Interaktyvus skeletas su judesio, garso ir šviesos efektais. Dekoracija namų įėjimui ar Helovyno vakarėlio erdvei.',
 2:'Didelis dekoratyvinis voratinklis su vorais. Tinka teminei Helovyno namų ar vakarėlio dekoracijai.',
 3:'Baltas dirbtinis voratinklis su vorais. Pakuotėje – 60 g dekoratyvinio voratinklio.',
 4:'Didelis dekoratyvinis voratinklis su vorais. Tinka teminei Helovyno namų ar vakarėlio dekoracijai.',
 5:'Plaukuotas 50 cm voras Helovyno dekorui. Juoda dekoracija namams ar vakarėlio erdvei.',
 6:'Juodas dekoratyvinis audinys-voratinklis Helovyno namų ir vakarėlio dekorui.',
 7:'Dekoratyvinis voratinklis su voru, 195 × 78 cm. Helovyno dekoracija namams ir teminėms šventėms.',
 8:'Dirbtinis kraujas Helovyno kostiumams ir grimui. Buteliuko talpa – 100 ml.',
 9:'Skystas dirbtinis kraujas Helovyno dekoracijoms, kostiumams ir grimui. Talpa – 100 ml.',
 10:'Trijų dekoratyvinių moliūgų rinkinys su žvakutėmis. Helovyno akcentas namų ar vakarėlio dekorui.',
 11:'Juodas dekoratyvinis audinys-voratinklis, 183 cm. Tinka Helovyno scenografijai namuose.',
 12:'Helovyno dekoracijų rinkinys su girlianda, balionais ir voratinkliu. Skirtas teminei vakarėlio erdvei papuošti.',
 13:'Trijų moliūgų rinkinys su LED žibintais. Šviečianti Helovyno dekoracija namams.',
 14:'Dekoratyvinis voratinklis su kraujo motyvu. Skirtas Helovyno vakarėlio erdvei ir namų dekorui.',
 15:'116 dalių balionų ir girliandos rinkinys Helovyno šventei. Vienoje pakuotėje – visas dekoravimo rinkinys.',
 16:'75 cm kabanti skeleto ir vaiduoklio dekoracija. Skirta Helovyno namų ar vakarėlio erdvei.',
 17:'Kabanti kaukolės, skeleto ir vaiduoklio dekoracija Helovynui. Lengvai pritaikomas teminės scenografijos akcentas.',
 18:'150 cm juodas dekoratyvinis voratinklis su voru. Skirtas Helovyno dekorui.',
 19:'Helovyno LED žibintas su moliūgo motyvu. Šviečiantis akcentas namų ir vakarėlio dekorui.',
 20:'75 cm rudas plaukuotas voras. Helovyno dekoracija teminei namų ar vakarėlio scenografijai.',
 21:'Didelis plaukuotas voras su raudonomis akimis ir lankstomomis kojomis. Dekoratyvinis Helovyno akcentas namams.',
 22:'Kabantis plastikinis žmogaus skeletas, 90 cm. Skirtas Helovyno dekoracijoms namuose ir vakarėlių erdvėse.',
 23:'Juodas katiliuko formos kibirėlis saldumynams. Helovyno aksesuaras šventei ir namų dekorui.',
 24:'60 g balto dirbtinio voratinklio pakuotė su vorais. Tinka Helovyno teminei erdvei papuošti.',
 25:'Juodai pilka dekoratyvinė užuolaida, 150 × 190 cm. Helovyno akcentas namų ar vakarėlio scenografijai.',
 26:'Raganos figūros dekoracija langui ar durims. Išraiškingas Helovyno akcentas namams.',
 27:'Trijų 25 cm žvakių rinkinys su raudono vaško efektu. Dekoratyvinis akcentas Helovyno stalui.',
 28:'Kabantis fluorescencinis skeletas, kuris po apšvietimo švyti tamsoje. Helovyno dekoracija namų erdvei.',
 29:'75 cm kabanti skeleto ir vaiduoklio dekoracija. Skirta Helovyno namų ar vakarėlio erdvei.',
 30:'Šešių dekoratyvinių kaukolių rinkinys. Kiekviena kaukolė – 8 cm aukščio, pagaminta iš plastiko.',
 31:'Dviejų dekoratyvinių 40 cm skeletų rinkinys. Helovyno akcentai namams ir teminėms šventėms.',
 32:'Šeši lateksiniai balionai su Helovyno motyvais. Rinkinys šventinės erdvės dekoravimui.',
 33:'Didelis juodas plaukuotas voras su raudonomis akimis ir lankstomomis kojomis. Helovyno dekoracija namams.',
 34:'Dekoratyvinis dirbtinis voratinklis, 76 × 183 cm. Tinka teminei Helovyno namų ar vakarėlio erdvei.',
 35:'Juodas plaukuotas voras, 50 cm. Dekoratyvinis Helovyno akcentas namams.',
 36:'50 ml dirbtinio kraujo buteliukas Helovyno grimui ir kostiumams.',
 37:'Plastikinis 90 cm žmogaus skeletas. Helovyno dekoracija teminei namų ar vakarėlio erdvei.',
 38:'Didelis 90 cm voras Helovyno dekorui. Tinka teminei namų ar vakarėlio scenografijai.',
 39:'27 balionų rinkinys su Helovyno ir konfeti motyvais. Skirtas šventinei erdvei dekoruoti.',
 40:'56 šikšnosparnių formos 3D sienų lipdukai. Rinkinys Helovyno namų ir vakarėlio dekorui.',
 41:'60 juodų šikšnosparnių formos 3D sienų lipdukų. Dekoratyvinis rinkinys Helovyno erdvei.',
 42:'Baltas kabantis vaiduoklio žibintas, 90 cm. LED apšvietimas maitinamas baterijomis, kurios pridedamos prie rinkinio.',
 43:'3 m girlianda su 20 šviečiančių moliūgų. Maitinama AA baterijomis, kurios į rinkinį neįeina.',
 44:'Apie 180 cm kabanti skeleto dekoracija su garso efektais ir raudonai šviečiančiomis akimis. Skirta Helovyno namų ar vakarėlio scenografijai.',
 45:'Kabanti vaiduoklio, skeleto ir kaukolės dekoracija. Helovyno akcentas namams ir teminėms šventėms.',
 46:'Baltas kabantis vaiduoklis, 60 cm. Dekoracija Helovyno namų ir vakarėlio erdvei.',
 47:'Dekoratyvinis voratinklis su 70 oranžinių LED švieselių. Maitinamas trimis AA baterijomis, kurios į rinkinį neįeina.',
 48:'Dešimties plastikinių maišelių rinkinys saldainiams ir nedidelėms dovanoms. Helovyno aksesuaras šventei.',
 49:'Juodas dekoratyvinis voratinklis su voru, 150 cm. Helovyno akcentas namų scenografijai.',
 50:'Aštuonių tikroviškų dekoratyvinių vorų rinkinys. Kiekvienas voras – 8 cm dydžio.',
 51:'Didelis juodas dekoratyvinis voratinklis, 192 × 78 cm. Tinka Helovyno teminei erdvei papuošti.',
 52:'Juoda staltiesė su kaulų, kaukolių ir skeletų motyvais, 177 × 134 cm. Skirta Helovyno šventės stalui.',
 53:'Plastikinis 165 cm kabantis skeletas su judinamomis galūnėmis ir žandikauliu. Yra virvelė pakabinimui.',
 54:'Trijų baltų kabančių vaiduoklių rinkinys. Lengvos dekoracijos namų ir Helovyno vakarėlio erdvei.',
 55:'Penkiasdešimties juodų dirbtinių vorų rinkinys. Smulkūs dekoratyviniai akcentai Helovyno scenografijai.',
 56:'Plastikinis 40 cm kabantis žmogaus skeletas. Helovyno dekoracija namų ar vakarėlio erdvei.',
 57:'Penki oranžiniai šviečiantys lateksiniai balionai su moliūgų motyvais. Baliono dydis – apie 25 cm.',
 58:'150 cm girlianda su 10 šviečiančių LED moliūgų. Šilto atspalvio šviesa kuria Helovyno nuotaiką namuose.',
 59:'Juoda dekoratyvinė užuolaida su šikšnosparnių motyvais. Skirta Helovyno vakarėlio erdvei papuošti.',
 60:'Trijų baltų kabančių vaiduoklių rinkinys. Dekoracijos Helovyno langams, sienoms ir šventinei erdvei.',
}

def clean_title(s):
    return s.replace('Helovino','Helovyno').replace('Helovinui','Helovynui')

def slug(s):
    s=unicodedata.normalize('NFKD',s.lower()).encode('ascii','ignore').decode()
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')[:100].rstrip('-')

def category(name):
    n=name.lower()
    if 'balion' in n or ('rinkin' in n and 'moliūg' not in n):return 'rinkiniai'
    if 'krauj' in n or 'saldain' in n or 'stalties' in n:return 'aksesuarai'
    if 'vor' in n:return 'vorai'
    if 'moliūg' in n:return 'moliugai'
    if 'skelet' in n or 'vaiduok' in n or 'kaukol' in n:return 'vaiduokliai'
    return 'aksesuarai'

products=[]; manifest=[]
for r in sorted(records,key=lambda r:r['position']):
    if not r.get('photos'):continue
    offer=re.search(r'offerId=(\d+)',r['sourceUrl']).group(1)
    product_id=f'hw-{offer}'
    name=clean_title(r['titleLt'])
    # Supplier size fields conflict with the translated title for this offer.
    if r['position']==6:name='Juodas dekoratyvinis audinys-voratinklis XXL – Helovyno dekoracija'
    if r['position']==33:name='Milžiniškas plaukuotas voras, tarantulas – Helovyno dekoracija'
    if r['position']==36:name='Tikroviškas dirbtinis kraujas, 50 ml – Helovyno grimui'
    if r['position']==45:name='Kabanti vaiduoklio, skeleto ir kaukolės dekoracija – Helovynui'
    if r['position']==54:name='Baisūs kabantys vaiduokliai, 3 vnt. – Helovyno dekoracija'
    photos=[]
    for i,photo in enumerate(r['photos'],1):
        src=Path(photo['path'])
        with Image.open(src) as im:
            im.verify()
            ext={'JPEG':'.jpg','PNG':'.png','WEBP':'.webp'}.get(im.format)
        if not ext:raise ValueError(f'Unsupported photo format: {src}')
        dest=ROOT/'public/products/halloween'/f'{product_id}-{i}{ext}'
        dest.parent.mkdir(parents=True,exist_ok=True)
        if src.resolve()!=dest.resolve():shutil.copyfile(src,dest)
        photos.append('/'+str(dest.relative_to(ROOT/'public')))
    specs=[]
    for label,value in r.get('specsPl',[]):
        if label not in labels or value in ('bez marki','inny'):continue
        value=values.get(value,value).replace('szt.','vnt.')
        if r['position']==43 and label=='Liczba sztuk w zestawie':
            specs.append({'label':'LED šviesos taškų skaičius','value':'20'})
        else:specs.append({'label':labels[label],'value':value})
    specs.extend([{'label':'Prekės kodas','value':product_id.upper()},
                  {'label':'Pristatymas','value':'Per 4 dienas visoje Lietuvoje'}])
    color=next((values.get(v,'') for k,v in r.get('specsPl',[]) if k=='Kolor'),'')
    description=descriptions.get(r['position'],f'{name.rstrip(".")}. Skirta Helovyno dekorui.')
    products.append({'id':product_id,'slug':slug(name)+'-'+offer,'name':name,'mode':'buy',
                     'series':'halloween','kind':'decoration','sections':0,'price':r['price'],
                     'image':photos[0],'photos':photos,'color':color,'meters':0,
                     'description':description,'seoTitle':name,
                     'seoDescription':f'{description} Pristatymas per 4 dienas visoje Lietuvoje.',
                     'features':[name.split(' – ')[0],'Pristatymas per 4 dienas visoje Lietuvoje'],
                     'specs':specs,'decorationCategory':category(name),'deliveryDays':4})
    manifest.append({'sheetPosition':r['position'],'sheetRow':r['position']+1,
                     'productId':product_id,'sourceUrl':r['sourceUrl'],'retailPriceEur':r['price']})

assert len({p['id'] for p in products})==len(products)
(ROOT/'lib/data/halloweenProducts.ts').write_text('import type { Product } from "../types";\n\n'
    '// Patvirtintos pardavimo kainos iš lentelės „mūsų kaina“. Savikainos neviešinamos.\n'
    'export const halloweenProducts: Product[] = '+json.dumps(products,ensure_ascii=False,indent=2)+';\n')
private=ROOT/'.data/halloween-import';private.mkdir(parents=True,exist_ok=True)
(private/'fulfilment-map.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(f'Imported {len(products)} products and {sum(len(p["photos"]) for p in products)} original photos.')
