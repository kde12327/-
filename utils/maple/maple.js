const mapleData = require("../../data/maple");

const db = require('../../models');

const equipmentString = {
  "cap": "모자",
  "clothes": "상의",
  "pants": "하의",
  "shoes": "신발",
  "gloves": "장갑",
  "weapon": "무기",
  "subweapon": "보조무기",
  "shoulder": "견장",
  "cape": "망토",
  "emblem": "엠블렘",
  "ring": "반지",
  "earacc": "귀걸이",
  "eyeacc": "눈장식",
  "forehead": "얼굴장식",
  "pendant": "펜던트",
  "poket": "포켓",
  "belt": "벨트",
}
const equipmentStringReverse = {
  "모자" : "cap",
  "상의" : "clothes",
  "하의" : "pants",
  "신발" : "shoes",
  "장갑" : "gloves",
  "무기" : "weapon",
  "보조무기" : "subweapon",
  "견장" : "shoulder",
  "망토" : "cape",
  "엠블렘" : "emblem",
  "반지" : "ring",
  "귀걸이" : "earacc",
  "눈장식" : "eyeacc",
  "얼굴장식" : "forehead",
  "펜던트" : "pendant",
  "포켓" : "poket",
  "벨트" : "belt",
}
const rarityString = {
  "normal": "노멀 아이템",
  "rare": " 🟦레어 아이템",
  "epic": "🟪에픽 아이템",
  "unique": "🟨유니크 아이템",
  "legendary": "🟩레전더리 아이템",
}

const emoji_eternalrebirthflame = "<:eternalrebirthflame:971656195855241227>";
const emoji_redcube = "<:redcube:971655681730035722>";


function itemStatString(item, job, statAtkDefer)
{
  var result = "";
  result += "type : " + equipmentString[item.type] + "\n"
  result += "lv : " + item.level + "\n";
  result += "잠재옵션 등급 : " + rarityString[item.rarity] + "\n";
  if(statAtkDefer){
    result += "----------------------------\n";
    result += "스탯공격력 증가량 : +" + statAtkDefer + "\n";
  }


  var singleStatConst = Math.floor(item.level / 20) + 1;
  var doubleStatConst = Math.floor(item.level / 40) + 1;

  result += "----------------------------\n";
  result += "str : + " + mapleData["item"][item.type]["str"];
  if(item.additionalstr + item.additionalstrdex + item.additionalstrint + item.additionalstrluk != 0){
    var _num = 0;
    result += " + ";
    _num += (item.additionalstr != 0)?singleStatConst * (8 - item.additionalstr):0;
    _num += (item.additionalstrdex != 0)?doubleStatConst * (8 - item.additionalstrdex):0;
    _num += (item.additionalstrint != 0)?doubleStatConst * (8 - item.additionalstrint):0;
    _num += (item.additionalstrluk != 0)?doubleStatConst * (8 - item.additionalstrluk):0;
    result += _num + "\n";
  }
  else
    result +="\n";

  result += "dex : + " + mapleData["item"][item.type]["dex"];
  if(item.additionaldex + item.additionalstrdex + item.additionaldexint + item.additionaldexluk != 0){
    var _num = 0;
    result += " + ";
    _num += (item.additionaldex != 0)?singleStatConst * (8 - item.additionaldex):0;
    _num += (item.additionalstrdex != 0)?doubleStatConst * (8 - item.additionalstrdex):0;
    _num += (item.additionaldexint != 0)?doubleStatConst * (8 - item.additionaldexint):0;
    _num += (item.additionaldexluk != 0)?doubleStatConst * (8 - item.additionaldexluk):0;
    result += _num + "\n";
  }
  else
    result +="\n";

  result += "int : + " + mapleData["item"][item.type]["int"];
  if(item.additionalint + item.additionalstrint + item.additionaldexint + item.additionalintluk != 0){
    var _num = 0;
    result += " + ";
    _num += (item.additionalint != 0)?singleStatConst * (8 - item.additionalint):0;
    _num += (item.additionalstrint != 0)?doubleStatConst * (8 - item.additionalstrint):0;
    _num += (item.additionaldexint != 0)?doubleStatConst * (8 - item.additionaldexint):0;
    _num += (item.additionalintluk != 0)?doubleStatConst * (8 - item.additionalintluk):0;
    result += _num + "\n";
  }
  else
  result +="\n";

  result += "luk : + " + mapleData["item"][item.type]["luk"];
  if(item.additionalluk + item.additionalstrluk + item.additionaldexluk + item.additionalintluk != 0){
    var _num = 0;
    result += " + ";
    _num += (item.additionalluk != 0)?singleStatConst * (8 - item.additionalluk):0;
    _num += (item.additionalstrluk != 0)?doubleStatConst * (8 - item.additionalstrluk):0;
    _num += (item.additionaldexluk != 0)?doubleStatConst * (8 - item.additionaldexluk):0;
    _num += (item.additionalintluk != 0)?doubleStatConst * (8 - item.additionalintluk):0;
    result += _num + "\n";
  }
  else
    result +="\n";


  result += "공격력 : + ";
  if(item.type == "weapon"){
    result += mapleData["item"][item.type]["atk"];
    if(item.additionalatk != 0)
      result += " + " + (Math.floor(mapleData["item"][item.type]["atk"] * 0.2) *(6 - item.additionalatk))
    result += "\n";
  }else{
    result += mapleData["item"][item.type]["atk"];
    if(item.additionalatk != 0)
      result += " + " + (8 - item.additionalatk)
    result += "\n";
  }

  result += "마력 : + ";
  if(item.type == "weapon"){
    result += mapleData["item"][item.type]["matk"];
    if(item.additionalmatk != 0)
      result += " + " + (Math.floor(mapleData["item"][item.type]["matk"] * 0.2) *(6 - item.additionalmatk))
    result += "\n";
  }else{
    result += mapleData["item"][item.type]["matk"];
    if(item.additionalmatk != 0)
      result += " + " + (8 - item.additionalmatk)
    result += "\n";
  }

  if(item.type == "weapon"){
    result += "보스 몬스터 공격 시 데미지 : + " + mapleData["item"][item.type]["bossdmg"] + "%" + ((item.additionalbossdmg != 0)?(" + " + 2*(8 - item.additionalbossdmg) + "%"):"") + "\n";
  }
  result += "몬스터 방어율 무시 : + " + mapleData["item"][item.type]["penet"] + "%\n";
  if(item.additionaldmg)
    result += "데미지 : + " + (8 - item.additionaldmg) + "%\n";
  if(item.additionalallp != 0)
  result += "올스텟 : + " + (8 - item.additionalallp) + "%\n";


  result += "----------------------------\n잠재능력\n";
  result += item.potential1 + "\n";
  result += item.potential2 + "\n";
  result += item.potential3 + "\n";
  result += "\n\n----------------------------\n";

  return result;
}

function itemStat(item)
{
  var str = 0;
  var dex = 0;
  var int = 0;
  var luk = 0;
  var strp = 0;
  var dexp = 0;
  var intp = 0;
  var lukp = 0;
  var atk = 0;
  var atkp = 0;
  var matk = 0;
  var matkp = 0;
  var dmg = 0;
  var bossdmg = 0;
  var penet = 0;
  var crip = 0;

  var singleStatConst = Math.floor(item.level / 20) + 1;
  var doubleStatConst = Math.floor(item.level / 40) + 1;

  str += mapleData["item"][item.type]["str"];
  str += (item.additionalstr != 0)?singleStatConst * (8 - item.additionalstr):0;
  str += (item.additionalstrdex != 0)?doubleStatConst * (8 - item.additionalstrdex):0;
  str += (item.additionalstrint != 0)?doubleStatConst * (8 - item.additionalstrint):0;
  str += (item.additionalstrluk != 0)?doubleStatConst * (8 - item.additionalstrluk):0;

  dex += mapleData["item"][item.type]["dex"];
  dex += (item.additionaldex != 0)?singleStatConst * (8 - item.additionaldex):0;
  dex += (item.additionalstrdex != 0)?doubleStatConst * (8 - item.additionalstrdex):0;
  dex += (item.additionaldexint != 0)?doubleStatConst * (8 - item.additionaldexint):0;
  dex += (item.additionaldexluk != 0)?doubleStatConst * (8 - item.additionaldexluk):0;

  int += mapleData["item"][item.type]["int"];
  int += (item.additionalint != 0)?singleStatConst * (8 - item.additionalint):0;
  int += (item.additionalstrint != 0)?doubleStatConst * (8 - item.additionalstrint):0;
  int += (item.additionaldexint != 0)?doubleStatConst * (8 - item.additionaldexint):0;
  int += (item.additionalintluk != 0)?doubleStatConst * (8 - item.additionalintluk):0;

  luk += mapleData["item"][item.type]["luk"];
  luk += (item.additionalluk != 0)?singleStatConst * (8 - item.additionalluk):0;
  luk += (item.additionalstrluk != 0)?doubleStatConst * (8 - item.additionalstrluk):0;
  luk += (item.additionaldexluk != 0)?doubleStatConst * (8 - item.additionaldexluk):0;
  luk += (item.additionalintluk != 0)?doubleStatConst * (8 - item.additionalintluk):0;



  if(item.type == "weapon"){
    atk += mapleData["item"][item.type]["atk"];
    if(item.additionalatk != 0)
      atk +=  (Math.floor(mapleData["item"][item.type]["atk"] * 0.2) *(6 - item.additionalatk))
  }else{
    atk += mapleData["item"][item.type]["atk"];
    if(item.additionalatk != 0)
      atk += (8 - item.additionalatk);
  }

  if(item.type == "weapon"){
    matk += mapleData["item"][item.type]["matk"];
    if(item.additionalmatk != 0)
      matk += (Math.floor(mapleData["item"][item.type]["matk"] * 0.2) * (6 - item.additionalmatk))
  }else{
    matk += mapleData["item"][item.type]["matk"];
    if(item.additionalmatk != 0)
      atk += (8 - item.additionalmatk);
  }

  if(item.type == "weapon"){
    bossdmg += mapleData["item"][item.type]["bossdmg"] + ((item.additionalbossdmg != 0)?(2*(8 - item.additionalbossdmg)):0);
  }
  penet +=  mapleData["item"][item.type]["penet"];
  if(item.additionaldmg)
    dmg +=  8 - item.additionaldmg;
  if(item.additionalallp != 0){
    strp += 8 - item.additionalallp;
    dexp += 8 - item.additionalallp;
    intp += 8 - item.additionalallp;
    lukp += 8 - item.additionalallp;
  }


  var po = [];
  po.push(item.potential1);
  po.push(item.potential2);
  po.push(item.potential3);

  for(var i = 0; i < po.length; i++){
    switch (po[i]) {
      case "STR : +6":
        str += 6;
        break;
      case "DEX : +6":
        dex += 6;
        break;
      case "INT : +6":
        int += 6;
        break;
      case "LUK : +6":
        luk += 6;
        break;
      case "공격력 : +6":
        atk += 6;
        break;
      case "마력 : +6":
        matk += 6;
        break;
      case "STR : +12":
        str += 12;
        break;
      case "DEX : +12":
        dex += 12;
        break;
      case "INT : +12":
        int += 12;
        break;
      case "LUK : +12":
        luk += 12;
        break;
      case "공격력 : +12":
        atk += 12;
        break;
      case "마력 : +12":
        matk += 12;
        break;
      case "STR : +3%":
        strp += 3;
        break;
      case "DEX : +3%":
        dexp += 3;
        break;
      case "INT : +3%":
        intp += 3;
        break;
      case "LUK : +3%":
        lukp += 3;
        break;
      case "공격력 : +3%":
        atkp += 3;
        break;
      case "마력 : +3%":
        matkp += 3;
        break;
      case "크리티컬확률 : +4%":
        crip += 4;
        break;
      case "데미지 : +3%":
        dmg += 3;
        break;
      case "올스탯 : +5":
        str += 5;
        dex += 5;
        int += 5;
        luk += 5;
        break;
      case "몬스터 방어율 무시 : +15%":
        penet += (100 - penet) * 0.15;
        break;
      case "STR : +6%":
        strp += 6;
        break;
      case "DEX : +6%":
        dexp += 6;
        break;
      case "INT : +6%":
        intp += 6;
        break;
      case "LUK : +6%":
        lukp += 6;
        break;
      case "공격력 : +6%":
        atkp += 6;
        break;
      case "마력 : +6%":
        matkp += 6;
        break;
      case "크리티컬확률 : +8%":
        crip += 8;
        break;
      case "데미지 : +6%":
        dmg += 6;
        break;
      case "올스탯 : +3%":
        strp += 3;
        dexp += 3;
        intp += 3;
        lukp += 3;
        break;
      case "STR : +9%":
        strp += 9;
        break;
      case "DEX : +9%":
        dexp += 9;
        break;
      case "INT : +9%":
        intp += 9;
        break;
      case "LUK : +9%":
        lukp += 9;
        break;
      case "공격력 : +9%":
        atkp += 9;
        break;
      case "마력 : +9%":
        matkp += 9;
        break;
      case "크리티컬확률 : +9%":
        crip += 9;
        break;
      case "데미지 : +9%":
        dmg += 9;
        break;
      case "올스탯 : +6%":
        strp += 6;
        dexp += 6;
        intp += 6;
        lukp += 6;
        break;
      case "몬스터 방어율 무시 : +30%":
        penet += (100 - penet) * 0.30;
        break;
      case "보스 몬스터 공격 시 데미지 : +30%":
        bossdmg += 30;
        break;
      case "STR : +12%":
        strp += 12;
        break;
      case "DEX : +12%":
        dexp += 12;
        break;
      case "INT : +12%":
        intp += 12;
        break;
      case "LUK : +12%":
        lukp += 12;
        break;
      case "공격력 : +12%":
        atkp += 12;
        break;
      case "마력 : +12%":
        matkp += 12;
        break;
      case "크리티컬확률 : +12%":
        crip += 12;
        break;
      case "데미지 : +12%":
        dmg += 12;
        break;
      case "올스탯 : +9%":
        strp += 9;
        dexp += 9;
        intp += 9;
        lukp += 9;
        break;
      case "몬스터 방어율 무시 : +35%":
        penet += (100 - penet) * 0.35;
        break;
      case "몬스터 방어율 무시 : +40%":
        penet += (100 - penet) * 0.40;
        break;
      case "보스 몬스터 공격 시 데미지 : +35%":
        bossdmg += 35;
        break;
      case "보스 몬스터 공격 시 데미지 : +40%":
        bossdmg += 40;
        break;
      default:

    }
  }

  return {
    "str" : str,
    "dex" : dex,
    "int" : int,
    "luk" : luk,
    "strp" : strp,
    "dexp" : dexp,
    "intp" : intp,
    "lukp" : lukp,
    "atk" : atk,
    "atkp" : atkp,
    "matk" : matk,
    "matkp" : matkp,
    "dmg" : dmg,
    "bossdmg" : bossdmg,
    "penet" : penet,
    "crip" : crip,
  };
}

function getPlayerStat(items, job){
  var stat = 0;




  var str = 0;
  var dex = 0;
  var int = 0;
  var luk = 0;
  var strp = 0;
  var dexp = 0;
  var intp = 0;
  var lukp = 0;
  var atk = 0;
  var atkp = 0;
  var matk = 0;
  var matkp = 0;
  var dmg = 0;
  var bossdmg = 0;
  var penet = 35;
  var crip = 45;

  switch (job.id) {
    case 0:
    case 4:
      str = 1000;
      break;
    case 1:
    case 5:
      dex = 1000;

      break;
    case 2:
      int = 1000;

      break;
    case 3:
      luk = 1000;
      break;

  }

  items.forEach((item, i) => {
    var itemStats = itemStat(item);
    str += itemStats["str"];
    dex += itemStats["dex"];
    int += itemStats["int"];
    luk += itemStats["luk"];
    strp += itemStats["strp"];
    dexp += itemStats["dexp"];
    intp += itemStats["intp"];
    lukp += itemStats["lukp"];
    atk += itemStats["atk"];
    atkp += itemStats["atkp"];
    matk += itemStats["matk"];
    matkp += itemStats["matkp"];
    dmg += itemStats["dmg"];
    bossdmg += itemStats["bossdmg"];
    penet += (100 - penet) * itemStats["penet"] / 100;
    crip += itemStats["crip"];
  });



  switch (job.id) {
    case 0:
    case 4:
      stat = (str * (1 + strp * 0.01) * 4 + dex * (1 + dexp * 0.01)) * 0.01 * Math.floor(atk * (1 + atkp * 0.01)) * (1 + dmg * 0.01);
      break;
    case 1:
    case 5:
      stat = (dex * (1 + dexp * 0.01) * 4 + str * (1 + strp * 0.01)) * 0.01 * Math.floor(atk * (1 + atkp * 0.01)) * (1 + dmg * 0.01);

      break;
    case 2:
      stat = (int * (1 + intp * 0.01) * 4 + luk * (1 + lukp * 0.01)) * 0.01 * Math.floor(matk * (1 + matkp * 0.01)) * (1 + dmg * 0.01);
      break;
    case 3:
      stat = (luk * (1 + lukp * 0.01) * 4 + dex * (1 + dexp * 0.01)) * 0.01 * Math.floor(atk * (1 + atkp * 0.01)) * (1 + dmg * 0.01);
      break;

  }


  return {
    "statAtk": Math.floor(stat),
    "str" : str,
    "dex" : dex,
    "int" : int,
    "luk" : luk,
    "strp" : strp,
    "dexp" : dexp,
    "intp" : intp,
    "lukp" : lukp,
    "atk" : atk,
    "atkp" : atkp,
    "matk" : matk,
    "matkp" : matkp,
    "dmg" : dmg,
    "bossdmg" : bossdmg,
    "penet" : penet,
    "crip" : crip,
  };
}

function getPlayerStatString(muser, items, job){
  var stat = getPlayerStat(items, job);
  var result = "\n";
  result += "내정보 \n";
  result += "\n";

  result += "직업 : " + job.jobname + "\n";
  result += "\n";


  result += emoji_eternalrebirthflame + "영원한 환생의 불꽃: " + muser.eternalflame + "개 \n";
  result += emoji_redcube + "레드 큐브: " + muser.redcube + " 개\n";
  result += "스탯공격력 : " + stat["statAtk"] + "\n";
  result += "\n";

  result += "STR : " + Math.floor(stat["str"]* (1 + stat["strp"] / 100)) + "\n";
  result += "DEX : " + Math.floor(stat["dex"]* (1 + stat["dexp"] / 100)) + "\n";
  result += "INT : " + Math.floor(stat["int"]* (1 + stat["intp"] / 100)) + "\n";
  result += "LUK : " + Math.floor(stat["luk"]* (1 + stat["lukp"] / 100)) + "\n";
  result += "\n";

  result += "공격력 : " + Math.floor(stat["atk"] * ((100 + stat["atk"]) / 100)) + "\n";
  result += "마력 : " + Math.floor(stat["matk"] * ((100 + stat["matk"]) / 100)) + "\n";
  result += "데미지 : " + stat["dmg"] + "% \n";
  result += "몬스터 방어율 무시 : " + (Math.floor(stat["penet"] * 10) / 10)  + "% \n";
  result += "보스 몬스터 공격 시 데미지 : " + stat["bossdmg"] + "% \n";
  result += "크리티컬확률 : " + stat["crip"] + "% \n";
  result += "\n";

  result += "🏹예상 데미지(방어율 100% 기준) : " + Math.floor( stat["statAtk"] * stat["penet"] / 100 ) + "\n";
  result += "----------------------";


  return result;
}

function setAdditionalOption(type) {
  var option;
  if(type == "weapon"){
    option = JSON.parse(JSON.stringify(mapleData["additionalOption"].weapon));
  }else{
    option = JSON.parse(JSON.stringify(mapleData["additionalOption"].others));
  }
  var length = Object.keys(option).length;
  var indexArr = [];
  for (i=0; i<4; i++) {   //check if there is any duplicate index
    randomNum = Math.floor(Math.random() * length);
    if (indexArr.indexOf(randomNum) === -1) {
      var gradeRandomNum;
      var _ran = Math.random();
      if(_ran < 0.29)
        gradeRandomNum = 4;
      else if(_ran < 0.74)
        gradeRandomNum = 3;
      else if(_ran < 0.99)
        gradeRandomNum = 2;
      else
        gradeRandomNum = 1;




      indexArr.push(randomNum);
      option[Object.keys(option)[randomNum]] = gradeRandomNum;
    } else { //if the randomNum is already in the array retry
      i--;
    }
  }

  return option;
}

function randomPotentialOption(type, rarity){
  var result = "";
  var sum = 0;
  var arr = [];
  var i = 0;

  if(mapleData["potentialOption"][type]){
    if(rarity == "normal"){
      for(i = 0; i < mapleData["potentialOption"][type].normal.length; i++){
        sum += mapleData["potentialOption"][type].normal[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = mapleData["potentialOption"][type].normal[i][0];
    }else if(rarity == "rare"){
      for(i = 0; i < mapleData["potentialOption"][type].rare.length; i++){
        sum += mapleData["potentialOption"][type].rare[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = mapleData["potentialOption"][type].rare[i][0];
    }else if(rarity == "epic"){
      for(i = 0; i < mapleData["potentialOption"][type].epic.length; i++){
        sum += mapleData["potentialOption"][type].epic[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = mapleData["potentialOption"][type].epic[i][0];
    }else if(rarity == "unique"){
      for(i = 0; i < mapleData["potentialOption"][type].unique.length; i++){
        sum += mapleData["potentialOption"][type].unique[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = mapleData["potentialOption"][type].unique[i][0];
    }else{
      for(i = 0; i < mapleData["potentialOption"][type].legendary.length; i++){
        sum += mapleData["potentialOption"][type].legendary[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = mapleData["potentialOption"][type].legendary[i][0];
    }
  }else{
    if(rarity == "normal"){
      for(i = 0; i < mapleData["potentialOption"]["others"].normal.length; i++){
        sum += mapleData["potentialOption"]["others"].normal[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = mapleData["potentialOption"]["others"].normal[i][0];
    }else if(rarity == "rare"){
      for(i = 0; i < mapleData["potentialOption"]["others"].rare.length; i++){
        sum += mapleData["potentialOption"]["others"].rare[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = mapleData["potentialOption"]["others"].rare[i][0];
    }else if(rarity == "epic"){
      for(i = 0; i < mapleData["potentialOption"]["others"].epic.length; i++){
        sum += mapleData["potentialOption"]["others"].epic[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = mapleData["potentialOption"]["others"].epic[i][0];
    }else if(rarity == "unique"){
      for(i = 0; i < mapleData["potentialOption"]["others"].unique.length; i++){
        sum += mapleData["potentialOption"]["others"].unique[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = mapleData["potentialOption"]["others"].unique[i][0];
    }else{
      for(i = 0; i < mapleData["potentialOption"]["others"].legendary.length; i++){
        sum += mapleData["potentialOption"]["others"].legendary[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = mapleData["potentialOption"]["others"].legendary[i][0];
    }
  }




  return result;
}

function setPotentialOption(type, rarity) {
  var options = [];

  var random = Math.random();
  // 등급
  if(rarity == "rare"){
    if(random < 0.06){
      rarity = "epic";
    }
  }else if(rarity == "epic"){
    if(random < 0.018){
      rarity = "unique";
    }
  }else if(rarity == "unique"){
    if(random < 0.003){
      rarity = "legendary";
    }
  }

  // 옵션
  if(rarity == "rare"){
    //첫째줄
    options.push(randomPotentialOption(type, "rare"));

    //둘째줄
    random = Math.random();
    if(random < 0.1){
      options.push(randomPotentialOption(type, "rare"));
    }else{
      options.push(randomPotentialOption(type, "normal"));
    }

    //셋째줄
    random = Math.random();
    if(random < 0.01){
      options.push(randomPotentialOption(type, "rare"));
    }else{
      options.push(randomPotentialOption(type, "normal"));
    }
  }else if(rarity == "epic"){
    //첫째줄
    options.push(randomPotentialOption(type, "epic"));

    //둘째줄
    random = Math.random();
    if(random < 0.1){
      options.push(randomPotentialOption(type, "epic"));
    }else{
      options.push(randomPotentialOption(type, "rare"));
    }

    //셋째줄
    random = Math.random();
    if(random < 0.01){
      options.push(randomPotentialOption(type, "epic"));
    }else{
      options.push(randomPotentialOption(type, "rare"));
    }
  }else if(rarity == "unique"){
    //첫째줄
    options.push(randomPotentialOption(type, "unique"));

    //둘째줄
    random = Math.random();
    if(random < 0.1){
      options.push(randomPotentialOption(type, "unique"));
    }else{
      options.push(randomPotentialOption(type, "epic"));
    }

    //셋째줄
    random = Math.random();
    if(random < 0.01){
      options.push(randomPotentialOption(type, "unique"));
    }else{
      options.push(randomPotentialOption(type, "epic"));
    }
  }else{
    //첫째줄
    options.push(randomPotentialOption(type, "legendary"));

    //둘째줄
    random = Math.random();
    if(random < 0.1){
      options.push(randomPotentialOption(type, "legendary"));
    }else{
      options.push(randomPotentialOption(type, "unique"));
    }

    //셋째줄
    random = Math.random();
    if(random < 0.01){
      options.push(randomPotentialOption(type, "legendary"));
    }else{
      options.push(randomPotentialOption(type, "unique"));
    }
  }


  return [rarity, options];
}

function getBossRewardItem(type){
  return mapleData["item"][type];
}

async function manualUpdate(userid) {
  // legendary -> legendary bug fix
  // 2022-06-29
  var items = await db.MEquipmentItem.findAll({
    where:{
      MUserId: userid,
      rarity: "lengendary"
    }
  });
  for(var i = 0; i < items.length; i++){
    items[i].rarity = "legendary";
    await items[i].save();
  }

  // add some equipment
  // 22-07-16
  var addItemList = ["emblem", "shoulder", "cape", "subweapon"];

  for await(const itemType of addItemList){
    var item = await db.MEquipmentItem.findOne({
      where:{
        MUserId: userid,
        type: itemType
      }
    });

    if(!item){
      var ao = setAdditionalOption(itemType);
      var po = setPotentialOption(itemType, "rare");
      var itemStat = mapleData["item"][itemType];
      var _item = await db.MEquipmentItem.create({
        MUserId: userid,
        type: itemType,
        level: itemStat["level"],
        rarity: itemStat.randomPotentialOption?po[0]:0,
        additionalstr: itemStat.additionalOption?ao["str"]:0,
        additionaldex: itemStat.additionalOption?ao["dex"]:0,
        additionalint: itemStat.additionalOption?ao["int"]:0,
        additionalluk: itemStat.additionalOption?ao["luk"]:0,
        additionalstrdex: itemStat.additionalOption?ao["strdex"]:0,
        additionalstrint: itemStat.additionalOption?ao["strint"]:0,
        additionalstrluk: itemStat.additionalOption?ao["strluk"]:0,
        additionaldexint: itemStat.additionalOption?ao["dexint"]:0,
        additionaldexluk: itemStat.additionalOption?ao["dexluk"]:0,
        additionalintluk: itemStat.additionalOption?ao["intluk"]:0,
        additionalatk: itemStat.additionalOption?ao["atk"]:0,
        additionalmatk: itemStat.additionalOption?ao["matk"]:0,
        additionalbossdmg: itemStat.additionalOption?ao["bossdmg"]:0,
        additionaldmg: itemStat.additionalOption?ao["dmg"]:0,
        additionalallp: itemStat.additionalOption?ao["allp"]:0,
        potential1: itemStat.randomPotentialOption?po[1][0]:0,
        potential2: itemStat.randomPotentialOption?po[1][1]:0,
        potential3: itemStat.randomPotentialOption?po[1][2]:0,
      });
    }
  }



}

module.exports = {
  equipmentString: equipmentString,
  equipmentStringReverse: equipmentStringReverse,
  rarityString: rarityString,
  emoji_eternalrebirthflame: emoji_eternalrebirthflame,
  emoji_redcube: emoji_redcube,
  itemStatString: itemStatString,
  itemStat: itemStat,
  getPlayerStat: getPlayerStat,
  getPlayerStatString: getPlayerStatString,
  setAdditionalOption: setAdditionalOption,
  randomPotentialOption: randomPotentialOption,
  setPotentialOption: setPotentialOption,
  getBossRewardItem: getBossRewardItem,
  manualUpdate: manualUpdate,
}
