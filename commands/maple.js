const Discord = require('discord.js');

const db = require('../models');

const itemData = require('./maple.json')

const equipmentString = {
  "cap": "모자",
  "clothes": "상의",
  "pants": "하의",
  "shoes": "신발",
  "gloves": "장갑",
  "weapon": "무기",
}
const rarityString = {
  "normal": "노멀 아이템",
  "rare": " 🟦레어 아이템",
  "epic": "🟪에픽 아이템",
  "unique": "🟨유니크 아이템",
  "legendary": "🟩레전더리 아이템",
}



function createItem(type){
  var addiOp = setAdditionalOption(type);
  var potnOp = setPotentialOption(type);
  return [addiOp, potnOp]
}

function itemStatString(item)
{
  var result = "";
  result += equipmentString[item.type] + "\n"
  result += item.level + "\n";
  result += rarityString[item.rarity] + "\n";

  var singleStatConst = item.level / 20 + 1;
  var doubleStatConst = item.level / 40 + 1;

  result += "----------------------------\n";
  result += "str : + " + itemData["defaultStat"][item.type]["str"];
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

  result += "dex : + " + itemData["defaultStat"][item.type]["dex"];
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

  result += "int : + " + itemData["defaultStat"][item.type]["int"];
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

  result += "luk : + " + itemData["defaultStat"][item.type]["luk"];
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
    result += itemData["defaultStat"][item.type]["atk"];
    if(item.additionalatk != 0)
      result += " + " + (Math.floor(itemData["defaultStat"][item.type]["atk"] * 0.2) *(6 - item.additionalatk))
    result += "\n";
  }else{
    result += itemData["defaultStat"][item.type]["atk"];
    if(item.additionalatk != 0)
      result += " + " + (8 - item.additionalatk)
    result += "\n";
  }

  result += "마력 : + ";
  if(item.type == "weapon"){
    result += itemData["defaultStat"][item.type]["matk"];
    if(item.additionalmatk != 0)
      result += " + " + (Math.floor(itemData["defaultStat"][item.type]["matk"] * 0.2) *(6 - item.additionalmatk))
    result += "\n";
  }else{
    result += itemData["defaultStat"][item.type]["matk"];
    if(item.additionalmatk != 0)
      result += " + " + (8 - item.additionalmatk)
    result += "\n";
  }

  if(item.type == "weapon"){
    result += "보스 몬스터 공격 시 데미지 : + " + itemData["defaultStat"][item.type]["bossdmg"] + "%" + ((item.additionalbossdmg != 0)?(" + " + 2*(8 - item.additionalbossdmg) + "%"):"") + "\n";
  }
  result += "몬스터 방어율 무시 : + " + itemData["defaultStat"][item.type]["penet"] + "%\n";
  if(item.additionaldmg)
    result += "데미지 : + " + (8 - item.additionaldmg) + "%\n";
  if(item.additionalallp != 0)
  result += "올스텟 : + " + (8 - item.additionalallp) + "%\n";


  result += "----------------------------\n잠재능력\n";
  result += item.potential1 + "\n";
  result += item.potential2 + "\n";
  result += item.potential3 + "\n";
  result += "----------------------------\n";

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

  var singleStatConst = item.level / 20 + 1;
  var doubleStatConst = item.level / 40 + 1;

  str += itemData["defaultStat"][item.type]["str"];
  str += (item.additionalstr != 0)?singleStatConst * (8 - item.additionalstr):0;
  str += (item.additionalstrdex != 0)?doubleStatConst * (8 - item.additionalstrdex):0;
  str += (item.additionalstrint != 0)?doubleStatConst * (8 - item.additionalstrint):0;
  str += (item.additionalstrluk != 0)?doubleStatConst * (8 - item.additionalstrluk):0;

  dex += itemData["defaultStat"][item.type]["dex"];
  dex += (item.additionaldex != 0)?singleStatConst * (8 - item.additionaldex):0;
  dex += (item.additionalstrdex != 0)?doubleStatConst * (8 - item.additionalstrdex):0;
  dex += (item.additionaldexint != 0)?doubleStatConst * (8 - item.additionaldexint):0;
  dex += (item.additionaldexluk != 0)?doubleStatConst * (8 - item.additionaldexluk):0;

  int += itemData["defaultStat"][item.type]["int"];
  int += (item.additionalint != 0)?singleStatConst * (8 - item.additionalint):0;
  int += (item.additionalstrint != 0)?doubleStatConst * (8 - item.additionalstrint):0;
  int += (item.additionaldexint != 0)?doubleStatConst * (8 - item.additionaldexint):0;
  int += (item.additionalintluk != 0)?doubleStatConst * (8 - item.additionalintluk):0;

  luk += itemData["defaultStat"][item.type]["luk"];
  luk += (item.additionalluk != 0)?singleStatConst * (8 - item.additionalluk):0;
  luk += (item.additionalstrluk != 0)?doubleStatConst * (8 - item.additionalstrluk):0;
  luk += (item.additionaldexluk != 0)?doubleStatConst * (8 - item.additionaldexluk):0;
  luk += (item.additionalintluk != 0)?doubleStatConst * (8 - item.additionalintluk):0;



  if(item.type == "weapon"){
    atk += itemData["defaultStat"][item.type]["atk"];
    if(item.additionalatk != 0)
      atk +=  (Math.floor(itemData["defaultStat"][item.type]["atk"] * 0.2) *(6 - item.additionalatk))
  }else{
    atk += itemData["defaultStat"][item.type]["atk"];
    if(item.additionalatk != 0)
      atk += (8 - item.additionalatk);
  }

  if(item.type == "weapon"){
    matk += itemData["defaultStat"][item.type]["matk"];
    if(item.additionalmatk != 0)
      matk += (Math.floor(itemData["defaultStat"][item.type]["matk"] * 0.2) * (6 - item.additionalmatk))
  }else{
    matk += itemData["defaultStat"][item.type]["matk"];
    if(item.additionalmatk != 0)
      atk += (8 - item.additionalmatk);
  }

  if(item.type == "weapon"){
    bossdmg += itemData["defaultStat"][item.type]["bossdmg"] + ((item.additionalbossdmg != 0)?(2*(8 - item.additionalbossdmg)):0);
  }
  penet +=  itemData["defaultStat"][item.type]["penet"];
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
        penet += penet + (100 - penet) * 0.15;
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
        penet += penet + (100 - penet) * 0.30;
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
        penet += penet + (100 - penet) * 0.35;
        break;
      case "몬스터 방어율 무시 : +40%":
        penet += penet + (100 - penet) * 0.40;
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
  var penet = 0;
  var crip = 0;

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
    penet = penet + (100 - penet) * itemStats["penet"] / 100;
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
  console.log(stat)
  var result = "\n";
  result += "내정보 \n";
  result += "영원한 환생의 불꽃: " + muser.eternalflame + "개 \n";
  result += "레드 큐브: " + muser.redcube + " 개\n";
  result += "스탯공격력 : " + stat["statAtk"] + "\n";

  result += "STR : " + Math.floor(stat["str"]* (1 + stat["strp"] / 100)) + "\n";
  result += "DEX : " + Math.floor(stat["dex"]* (1 + stat["dexp"] / 100)) + "\n";
  result += "INT : " + Math.floor(stat["int"]* (1 + stat["intp"] / 100)) + "\n";
  result += "LUK : " + Math.floor(stat["luk"]* (1 + stat["lukp"] / 100)) + "\n";

  result += "데미지 : " + stat["dmg"] + "% \n";
  result += "몬스터 방어율 무시 : " + (Math.floor(stat["penet"] * 10) / 10)  + "% \n";
  result += "보스 몬스터 공격 시 데미지 : " + stat["bossdmg"] + "% \n";
  result += "크리티컬확률 : " + stat["crip"] + "% \n";
  result += "----------------------";


  return result;
}

function setAdditionalOption(type) {
  var option;
  if(type == "weapon"){
    option = JSON.parse(JSON.stringify(itemData.additionalOption.weapon));
  }else{
    option = JSON.parse(JSON.stringify(itemData.additionalOption.others));
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
  if(type == "weapon"){
    if(rarity == "normal"){
      for(i = 0; i < itemData.potentialOption.weapon.normal.length; i++){
        sum += itemData.potentialOption.weapon.normal[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = itemData.potentialOption.weapon.normal[i][0];
    }else if(rarity == "rare"){
      for(i = 0; i < itemData.potentialOption.weapon.rare.length; i++){
        sum += itemData.potentialOption.weapon.rare[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = itemData.potentialOption.weapon.rare[i][0];
    }else if(rarity == "epic"){
      for(i = 0; i < itemData.potentialOption.weapon.epic.length; i++){
        sum += itemData.potentialOption.weapon.epic[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = itemData.potentialOption.weapon.epic[i][0];
    }else if(rarity == "unique"){
      for(i = 0; i < itemData.potentialOption.weapon.unique.length; i++){
        sum += itemData.potentialOption.weapon.unique[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = itemData.potentialOption.weapon.unique[i][0];
    }else{
      for(i = 0; i < itemData.potentialOption.weapon.lengendary.length; i++){
        sum += itemData.potentialOption.weapon.lengendary[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = itemData.potentialOption.weapon.lengendary[i][0];
    }
  }else{
    if(rarity == "normal"){
      for(i = 0; i < itemData.potentialOption.others.normal.length; i++){
        sum += itemData.potentialOption.others.normal[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = itemData.potentialOption.others.normal[i][0];
    }else if(rarity == "rare"){
      for(i = 0; i < itemData.potentialOption.others.rare.length; i++){
        sum += itemData.potentialOption.others.rare[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = itemData.potentialOption.others.rare[i][0];
    }else if(rarity == "epic"){
      for(i = 0; i < itemData.potentialOption.others.epic.length; i++){
        sum += itemData.potentialOption.others.epic[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = itemData.potentialOption.others.epic[i][0];
    }else if(rarity == "unique"){
      for(i = 0; i < itemData.potentialOption.others.unique.length; i++){
        sum += itemData.potentialOption.others.unique[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = itemData.potentialOption.others.unique[i][0];
    }else{
      for(i = 0; i < itemData.potentialOption.others.lengendary.length; i++){
        sum += itemData.potentialOption.others.lengendary[i][1];
        arr.push(sum);
      }
      var rd = Math.random() * sum;

      for(i = 0; i < arr.length; i++){
        if(arr[i] > rd){
          break;
        }
      }
      result = itemData.potentialOption.others.lengendary[i][0];
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
      rarity = "lengendary";
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
    options.push(randomPotentialOption(type, "lengendary"));

    //둘째줄
    random = Math.random();
    if(random < 0.1){
      options.push(randomPotentialOption(type, "lengendary"));
    }else{
      options.push(randomPotentialOption(type, "unique"));
    }

    //셋째줄
    random = Math.random();
    if(random < 0.01){
      options.push(randomPotentialOption(type, "lengendary"));
    }else{
      options.push(randomPotentialOption(type, "unique"));
    }
  }


  return [rarity, options];
}

exports.run = async (client, message, [action, args]) => {
  if(message.author.bot) return;
  var author = message.author;
  var channel = message.channel;
  if(!channel.name == "maplestory")return;

  if(action == "가입"){
    try{
      var user = await db.MUser.findOne({
        where: {
          id: author.id,
        }
      });
      var jobs = await db.MJob.findAll();

      // var [user, userCreated] = await db.MUser.findOrCreate({
      //   where: {
      //     id: author.id,
      //   },
      //   defaults: {
      //     id: author.id,
      //     username: author.username,
      //     level: 10,
      //     redcube: 20,
      //     eternalflame: 20,
      //   },
      // });
      if(user){
        channel.send("이미 가입되었습니다.")
      }else{
        var jobChoiceMessage = await channel.send("직업을 선택해주세요.\n1.전사 2.궁수 3.법사 4.도적 5.힘해적 6.덱해적");
        const jobChoiceFilter = (reaction, user) => {
          return ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','❌'].includes(reaction.emoji.name) && user.id !== client.user.id;
        };
        await Promise.all([
          jobChoiceMessage.react('1️⃣'),
          jobChoiceMessage.react('2️⃣'),
          jobChoiceMessage.react('3️⃣'),
          jobChoiceMessage.react('4️⃣'),
          jobChoiceMessage.react('5️⃣'),
          jobChoiceMessage.react('6️⃣'),
          jobChoiceMessage.react('❌'),
        ]);
        var jobId = 0;
        var jobChoiceExitFlag = false;
        var startTime = new Date();
        while((jobId == 0 && !jobChoiceExitFlag) || new Date() - startTime > 60000){
          await jobChoiceMessage.awaitReactions(jobChoiceFilter, { max: 1, time: 60000, errors: ['time'] })
            .then(async function(data) {
              const reaction = data.first();
              if (reaction.emoji.name === '1️⃣') {
                jobId = 0;
              }else if (reaction.emoji.name === '2️⃣') {
                jobId = 1;
              }else if (reaction.emoji.name === '3️⃣') {
                jobId = 2;
              }else if (reaction.emoji.name === '4️⃣') {
                jobId = 3;
              }else if (reaction.emoji.name === '5️⃣') {
                jobId = 4;
              }else if (reaction.emoji.name === '6️⃣') {
                jobId = 5;
              }else if (reaction.emoji.name === '❌') {
                stopFlag = true;
              }
            }).catch(async function(data) {
              console.log(data);
            });
        }

        if(jobChoiceExitFlag){
          jobChoiceMessage.delete();
          return;
        }

        user = await db.MUser.create({
          id: author.id,
          username: author.username,
          level: 10,
          redcube: 20,
          eternalflame: 20,
          MJobId: jobId,
        });
        items = []
        Object.keys(itemData["defaultStat"]).forEach(async (itemType, i) => {
          var ao = setAdditionalOption(itemType);
          var po = setPotentialOption(itemType, "rare");
          var item = await db.MEquipmentItem.create({
            MUserId: author.id,
            type: itemType,
            level: itemData["defaultStat"][itemType]["level"],
            rarity: po[0],
            additionalstr: ao["str"],
            additionaldex: ao["dex"],
            additionalint: ao["int"],
            additionalluk: ao["luk"],
            additionalstrdex: ao["strdex"],
            additionalstrint: ao["strint"],
            additionalstrluk: ao["strluk"],
            additionaldexint: ao["dexint"],
            additionaldexluk: ao["dexluk"],
            additionalintluk: ao["intluk"],
            additionalatk: ao["atk"],
            additionalmatk: ao["matk"],
            additionalbossdmg: ao["bossdmg"],
            additionaldmg: ao["dmg"],
            additionalallp: ao["allp"],
            potential1: po[1][0],
            potential2: po[1][1],
            potential3: po[1][2],
          });
          channel.send(itemStatString(item))
          items.push(item);
        });

        if(user){
          jobChoiceMessage.edit("이름: " + user.username + " 직업: "+ jobs[user.MJobId].jobname + " 계정이 생성되었습니다.");
          jobChoiceMessage.reactions.removeAll();
        }else{
          jobChoiceMessage.edit("계정 생성에 실패했습니다.");
        }
      }

    }catch(error){
      console.log(error)
    }
  }else if(action == "내정보"){
    var muser = await db.MUser.findOne({
      where: {
        id: author.id,
      }
    });
    if(!muser){
      segcjannel.send(user.username + " 유저가 존재하지 않습니다. !maple 가입 명령어를 통해 유저를 생성해주세요.");
      return;
    }

    var job = await db.MJob.findOne({
      where: {
        id: muser.MJobId
      }
    });

    var items = await db.MEquipmentItem.findAll({
      where:{
        MUserId: muser.id
      }
    })
    message.reply(getPlayerStatString(muser, items, job));

  }else if(action == "장비"){
    console.log("1" + args + "1")
    var muser = await db.MUser.findOne({
      where: {
        id: author.id,
      }
    });
    if(!muser){
      segcjannel.send(user.username + " 유저가 존재하지 않습니다. !maple 가입 명령어를 통해 유저를 생성해주세요.");
      return;
    }
    var job = await db.MJob.findOne({
      where: {
        id: muser.MJobId
      }
    });
    var item;
    switch (args) {
      case "모자":
        item = await db.MEquipmentItem.findOne({
          where:{
            MUserId: muser.id,
            type: "cap"
          }
        });
        break;
      case "상의":
        item = await db.MEquipmentItem.findOne({
          where:{
            MUserId: muser.id,
            type: "clothes"
          }
        });
        break;
      case "하의":
        item = await db.MEquipmentItem.findOne({
          where:{
            MUserId: muser.id,
            type: "pants"
          }
        });
        break;
      case "신발":
        item = await db.MEquipmentItem.findOne({
          where:{
            MUserId: muser.id,
            type: "shoes"
          }
        });
        break;
      case "장갑":
        item = await db.MEquipmentItem.findOne({
          where:{
            MUserId: muser.id,
            type: "gloves"
          }
        });
        break;
      case "무기":
        item = await db.MEquipmentItem.findOne({
          where:{
            MUserId: muser.id,
            type: "weapon"
          }
        });
        break;
    }
    var itemStat = itemStatString(item, job);
    itemStat += "\n영원한 환생의 불꽃 : " + muser.eternalflame + "개\n";
    itemStat += "\n레드 큐브 : " + muser.redcube + "개\n";
    replyMessage = await message.channel.send(itemStat);

    var equipmentStatExitFlag = false;
    await Promise.all([
      replyMessage.react('🔥'),
      replyMessage.react('🟥'),
      replyMessage.react('❌'),
    ]);
    const equipmentStatFilter = (reaction, user) => {
      return  ['🔥', '🟥', '❌'].includes(reaction.emoji.name) && user.id !== client.user.id;
    };

    var startTime = new Date();
    while(!equipmentStatExitFlag || new Date() - startTime > 120000){
      var itemStat = itemStatString(item, job);
      itemStat += "\n영원한 환생의 불꽃 : " + muser.eternalflame + " 개\n";
      itemStat += "레드 큐브 : " + muser.redcube + " 개\n";
      replyMessage.edit(itemStat);

      await replyMessage.awaitReactions(equipmentStatFilter, { max: 1, time: 60000, errors: ['time'] })
        .then(async function(data) {
          const reaction = data.first();

          if (reaction.emoji.name == '🔥') {
            if(muser.eternalflame == 0){
              replyMessage.edit(itemStat + "\n영원한 환생의 불꽃이 부족합니다.\n");
              return;
            }
            var ao = setAdditionalOption(item.type);
            item.additionalstr = ao["str"];
            item.additionaldex = ao["dex"];
            item.additionalint = ao["int"];
            item.additionalluk = ao["luk"];
            item.additionalstrdex = ao["strdex"];
            item.additionalstrint = ao["strint"];
            item.additionalstrluk = ao["strluk"];
            item.additionaldexint = ao["dexint"];
            item.additionaldexluk = ao["dexluk"];
            item.additionalintluk = ao["intluk"];
            item.additionalatk = ao["atk"];
            item.additionalmatk = ao["matk"];
            item.additionalbossdmg = ao["bossdmg"];
            item.additionaldmg = ao["dmg"];
            item.additionalallp = ao["allp"];
            await item.save();
            muser.eternalflame -= 1;
            await muser.save();
            // var users = replyMessage.reactions.resolve('🔥').users;
            // if(users.resolve(author.id)){
            await replyMessage.reactions.resolve('🔥').users.remove(author.id);
            // }

          }
          else if (reaction.emoji.name == '🟥'){
            if(muser.redcube == 0){
              replyMessage.edit(itemStat + "\n레드 큐브가 부족합니다.\n");
              return;
            }
            var po = setPotentialOption(item.type, item.rarity);
            item.rarity = po[0];
            item.potential1 = po[1][0];
            item.potential2 = po[1][1];
            item.potential3 = po[1][2];
            await item.save();
            muser.redcube -= 1;
            await muser.save();
            await replyMessage.reactions.resolve('🟥').users.remove(author.id);
          }
          else if (reaction.emoji.name == '❌'){
            equipmentStatExitFlag = true;
          }
        })

      }

      replyMessage.reactions.removeAll();


  }else if(action == "test"){
    // console.log(itemData);
    // var ao = setAdditionalOption("weapon");
    // var po = setPotentialOption("weapon", "rare");
    // // console.log(ao);
    // // console.log(po);
    // var item = await db.MEquipmentItem.create({
    //   username: author.username,
    //   type: "weapon",
    //   level: 160,
    //   rarity: po[0],
    //   additionalstr: ao["str"],
    //   additionaldex: ao["dex"],
    //   additionalint: ao["int"],
    //   additionalluk: ao["luk"],
    //   additionalstrdex: ao["strdex"],
    //   additionalstrint: ao["strint"],
    //   additionalstrluk: ao["strluk"],
    //   additionaldexint: ao["dexint"],
    //   additionaldexluk: ao["dexluk"],
    //   additionalintluk: ao["intluk"],
    //   additionalatk: ao["atk"],
    //   additionalmatk: ao["matk"],
    //   additionalbossdmg: ao["bossdmg"],
    //   additionaldmg: ao["dmg"],
    //   additionalallp: ao["allp"],
    //   potential1: po[1][0],
    //   potential2: po[1][1],
    //   potential3: po[1][2],
    // });
    //
    // console.log(item);
    // channel.send(itemStatString(item));

    var items = [];

    Object.keys(itemData["defaultStat"]).forEach(async (itemType, i) => {
      console.log(itemType)
      var ao = setAdditionalOption(itemType);
      var po = setPotentialOption(itemType, "rare");
      console.log(ao);
      var item = await db.MEquipmentItem.create({
        username: author.username,
        type: itemType,
        level: itemData["defaultStat"][itemType]["level"],
        rarity: po[0],
        additionalstr: ao["str"],
        additionaldex: ao["dex"],
        additionalint: ao["int"],
        additionalluk: ao["luk"],
        additionalstrdex: ao["strdex"],
        additionalstrint: ao["strint"],
        additionalstrluk: ao["strluk"],
        additionaldexint: ao["dexint"],
        additionaldexluk: ao["dexluk"],
        additionalintluk: ao["intluk"],
        additionalatk: ao["atk"],
        additionalmatk: ao["matk"],
        additionalbossdmg: ao["bossdmg"],
        additionaldmg: ao["dmg"],
        additionalallp: ao["allp"],
        potential1: po[1][0],
        potential2: po[1][1],
        potential3: po[1][2],
      });
      channel.send(itemStatString(item))
      items.push(item);
    });

    var job = await db.MJob.findOne({
      where: {
        "jobname": "도적"
      }
    })
    console.log(job)

    console.log(getPlayerStat(items, job));



  }


};

exports.getPlayerStat = getPlayerStat;
