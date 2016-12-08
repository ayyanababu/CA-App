/**
 * Ionicons icon set component.
 * Usage: <Ionicons name="icon-name" size={20} color="#4F8EF7" />
 */
import createIconSet from '../node_modules/react-native-vector-icons/lib/create-icon-set';
const glyphMap = {
  "icon-Mailall-01": 59669,
    "icon-Dragup-01": 59651,
    "icon-Cancel-01": 59649,
    "icon-Filter-01": 59653,
    "icon-Next-01": 59655,
    "icon-Search-01": 59657,
    "icon-Send-01": 59659,
    "icon-Back-01" : 59648,
    "icon-Comments" : 59650,
    "icon-Dropdown-01" : 59652,
    "icon-Menu-01" : 59654,
    "icon-Previous-01" : 59656,
    "icon-Selected-01" : 59658,
    "icon-Sort-01" : 59660,
    "icon-account_circle-01":59475,
    "icon-markunread-01":57689,
    "icon-phone-01": 57549,
    "icon-Comments-new": 59661
};

let CAAP = createIconSet(glyphMap, 'CAPP', "CAPP.ttf");

module.exports = CAAP;
module.exports.glyphMap = glyphMap;
