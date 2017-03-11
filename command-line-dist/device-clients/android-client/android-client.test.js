

var _index=require('./index');var _index2=_interopRequireDefault(_index);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

jest.mock('adbkit',function(){return{
createClient:function createClient(){return{};}};});


describe('Android Client',function(){
it('sets devices display name if present in adb properties',function(){
expect(_index2.default.getDisplayName({
'ro.build.version.release':'release',
'ro.product.display':'display',
'ro.product.brand':'brand',
'ro.product.model':'model'})).
toEqual('display');
});

it('sets devices display name from devices names json if not present in adb properties',function(){
expect(_index2.default.getDisplayName({
'ro.build.version.release':'release',
'ro.product.display':'',
'ro.product.brand':'brand',
'ro.product.model':'SM-N910V'})).
toEqual('Samsung Galaxy Note4');
});

it('sets devices display name from model and brand if not present in adb properties or in devices names json',function(){
expect(_index2.default.getDisplayName({
'ro.build.version.release':'release',
'ro.product.display':'',
'ro.product.brand':'brand',
'ro.product.model':'model'})).
toEqual('Brand model');
});
});