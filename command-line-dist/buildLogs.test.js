

var _buildLogs=require('./buildLogs');

describe('buildLogs',function(){
it('has a limited stored build logs',function(){
var firstBuildId=(0,_buildLogs.createBuildLog)();

expect(firstBuildId).toBeDefined();
expect((0,_buildLogs.getBuildLogs)(firstBuildId)).toEqual([]);

for(var i=0;i<_buildLogs.MAX_STORED_BUILD;i+=1){
(0,_buildLogs.createBuildLog)();
}

expect((0,_buildLogs.getBuildLogs)(firstBuildId)).toEqual(undefined);
});

it('gets build logs',function(){
var firstBuildId=(0,_buildLogs.createBuildLog)();
var secondBuildId=(0,_buildLogs.createBuildLog)();

(0,_buildLogs.addBuildLog)(firstBuildId,'log 1');
(0,_buildLogs.addBuildLog)(secondBuildId,'log 2');
(0,_buildLogs.addBuildLog)(firstBuildId,'log 3');

expect((0,_buildLogs.getBuildLogs)(firstBuildId)).toEqual(['log 1','log 3']);
});
});