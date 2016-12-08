/**
 * AdminDashboardController
 *
 * @description :: Server-side logic for managing admindashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var  googleapis             =   require('googleapis');
var  key                    =   require('service-account-credentials.json');
const VIEW_ID               =   'ga:130989248';
module.exports = {

        /* ==================================================================================================================================
                        To Get getDoughnutData
        ==================================================================================================================================== */
                getDoughnutData:  function(req,res){
                            var jwtClient = new googleapis.auth.JWT(
                            key.client_email, null, key.private_key,
                            ['https://www.googleapis.com/auth/analytics.readonly'], null);

                            jwtClient.authorize(function (err, tokens) {
                              if (err)
                               {
                                console.log(err);
                                return;
                              }
                              var analytics = googleapis.analytics('v3');
                              queryData(analytics);
                            });

                            function queryData(analytics) {
                                      analytics.data.ga.get({
                                        'auth': jwtClient,
                                        'ids': VIEW_ID,
                                        // 'metrics': 'ga:uniquePageviews',
                                        // 'dimensions': 'ga:pagePath',
                                        // 'start-date': '30daysAgo',
                                        // 'end-date': 'yesterday',
                                        // 'sort': '-ga:uniquePageviews',
                                        // 'max-results': 10,
                                        // 'filters': 'ga:pagePath=~/ch_[-a-z0-9]+[.]html$',
                                        'start-date': 'today',
                                        'end-date': 'today',
                                        'dimensions':'ga:mobileDeviceInfo',
                                        'metrics':'ga:sessions',
                                        //'segment': 'mobile',
                                      }, function (err, response) {
                                        if (err)
                                         {
                                          console.log(err);
                                          return res.json(200, {status: 2, error_details: err});
                                        }
                                        // console.log(JSON.stringify(response.rows, null, 4));
                                        return res.json(200,{status:1,message:'success',result:response.rows});
                                      });
                            }
                },
    /* ==================================================================================================================================
                        To Get getMapData
        ==================================================================================================================================== */
                getMapData:     function(req,res){

                                var jwtClient = new googleapis.auth.JWT(
                                key.client_email, null, key.private_key,
                                ['https://www.googleapis.com/auth/analytics.readonly'], null);

                                jwtClient.authorize(function (err, tokens) {
                                  if (err)
                                  {
                                    console.log(err);
                                    return;
                                  }
                                  var analytics = googleapis.analytics('v3');
                                  queryData(analytics);
                                });

                                function queryData(analytics) {
                                      analytics.data.ga.get({
                                        'auth': jwtClient,
                                        'ids': VIEW_ID,
                                        'start-date': 'today',
                                        'end-date': 'today',
                                         'dimensions': 'ga:city,ga:latitude,ga:longitude',
                                        'metrics': 'ga:sessions,ga:users',
                                      }, function (err, response) {
                                        if (err)
                                        {
                                          console.log(err);
                                          return res.json(200, {status: 2, error_details: err});
                                        }
                                        //console.log(response.rows);
                                        return res.json(200,{status:1,message:'success',result:response.rows});
                                      });
                                }

            },
    /* ==================================================================================================================================
                        To Get getBrowserDetails
        ==================================================================================================================================== */
            getBrowserDetails:  function(req,res){

                                var jwtClient = new googleapis.auth.JWT(
                                key.client_email, null, key.private_key,
                                ['https://www.googleapis.com/auth/analytics.readonly'], null);

                                jwtClient.authorize(function (err, tokens) {
                                  if (err)
                                  {
                                    console.log(err);
                                    return;
                                  }
                                  var analytics = googleapis.analytics('v3');
                                  queryData(analytics);
                                });

                                function queryData(analytics) {
                                      analytics.data.ga.get({
                                        'auth': jwtClient,
                                        'ids': VIEW_ID,
                                        'start-date': 'today',
                                        'end-date': 'today',
                                        'dimensions':'ga:browser',
                                        'metrics':'ga:sessions',
                                      }, function (err, response) {
                                        if (err)
                                         {
                                              console.log(err);
                                              return res.json(200, {status: 2, error_details: err});
                                        }
                                        // console.log(JSON.stringify(response.rows, null, 4));
                                        return res.json(200,{status:1,message:'success',result:response.rows});
                                      });
                                }
            },
    /* ==================================================================================================================================
                        To Get getPieChartData
        ==================================================================================================================================== */
            getPieChartData:function(req,res){

                            var jwtClient = new googleapis.auth.JWT(
                            key.client_email, null, key.private_key,
                            ['https://www.googleapis.com/auth/analytics.readonly'], null);

                            jwtClient.authorize(function (err, tokens) {
                              if (err)
                              {
                                console.log(err);
                                return;
                              }
                              var analytics = googleapis.analytics('v3');
                              queryData(analytics);
                            });

                            function queryData(analytics) {
                                      analytics.data.ga.get({
                                        'auth': jwtClient,
                                        'ids': VIEW_ID,
                                        'start-date': 'today',
                                        'end-date': 'today',
                                        // 'dimensions':'ga:userType,ga:country',
                                        'metrics':'ga:users,ga:screenviews,ga:screenviewsPerSession,ga:avgSessionDuration',
                                      }, function (err, response) {
                                        if (err)
                                        {
                                           console.log(err);
                                           return res.json(200, {status: 2, error_details: err});
                                        }

                                        return res.json(200,{status:1,message:'success',result:response.rows});
                                      });
                            }
            },
    /* ==================================================================================================================================
                        To Get getBarChartData
        ==================================================================================================================================== */
            getBarChartData:function(req,res){

                            var jwtClient = new googleapis.auth.JWT(
                            key.client_email, null, key.private_key,
                            ['https://www.googleapis.com/auth/analytics.readonly'], null);

                            jwtClient.authorize(function (err, tokens) {
                              if (err)
                              {
                                console.log(err);
                                return;
                              }
                              var analytics = googleapis.analytics('v3');
                              queryData(analytics);
                            });

                            function queryData(analytics) {
                                    var startDate = req.body.fromDate;
                                    var endDate = req.body.toDate;

                                  analytics.data.ga.get({
                                    'auth': jwtClient,
                                    'ids': VIEW_ID,
                                    'start-date': startDate,
                                    'end-date': endDate,
                                    'dimensions':'ga:date,ga:day,ga:yearMonth,ga:userType',
                                    'metrics':'ga:users',

                                  }, function (err, response) {
                                    if (err)
                                    {
                                       console.log(err);
                                       return res.json(200, {status: 2, error_details: err});
                                    }
                                    //console.log(JSON.stringify(response.rows, null, 4));


                                    return res.json(200,{status:1,message:'success',result:response.rows});
                                  });
                            }
            },
};

