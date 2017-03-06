(($, window) => {
  // Taken from http://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
  const getUrlParameter = (sParam) => {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  };

  let checkLogsInterval;

  const setHockeyAppNameValueFromPath = () => $('#hockeyAppName').val(getUrlParameter('appName'));

  const getLogClass = (log) => {
    const logLowerCased = log.toLowerCase();

    if (logLowerCased.indexOf('error') > -1) {
      return 'text-danger';
    }
    if (logLowerCased.indexOf('done') > -1) {
      return 'text-success';
    }

    return '';
  }

  const checkLogs = (buildId) => {
    $.get(`/build/${buildId}`, (logs) => {
      $('#logs').empty();
      logs.forEach((log) => {
        $('#logs').append(`<div class="${getLogClass(log)}">${log}</div>`);
        if (log === 'Done') clearInterval(checkLogsInterval);
      });
    }).fail(() => {
      window.alert('Aaaa something weird happened...');
    });
  };

  const installApp = () => {
    const hockeyAppName = $('#hockeyAppName').val();
    $('#logs').append('Here we go...');
    $.get('/install?appName=' + encodeURIComponent(hockeyAppName) + (document.getElementById('reinstall').checked ? '&reinstall=true' : ''), (buildId) => {
      checkLogsInterval = setInterval(() => checkLogs(buildId), 1000);
      checkLogs(buildId);
    }).fail(() => {
      window.alert('Aaaa something weird happened...');
    });
  };

  $('#install-button').click(installApp);
  setHockeyAppNameValueFromPath();
})($, window);
