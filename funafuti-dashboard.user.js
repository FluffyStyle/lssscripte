// ==UserScript==
// @name         FunaFuti-Dashboardhelper_Neu
// @version      1.1.0
// @author       Allure149
// @description  FunaFuti-Dashboard von Meyerscheeeee & FluffyStyle
// @include      /^https?:\/\/[www.]*(?:leitstellenspiel\.de|missionchief\.co\.uk|missionchief\.com|meldkamerspel\.com|centro-de-mando\.es|missionchief-australia\.com|larmcentralen-spelet\.se|operatorratunkowy\.pl|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com)\/.*$/
// @grant        none
// ==/UserScript==
/* global $ */

(async function() {
    'use strict';

    if(window.location.pathname != "/") return false;

    $('footer').prepend(`<li id="funaHelper" class="col-sm-3"><span style="color: white">FunaFuti-Dashboardhelper wird geladen.</span></li>`);

    var getCredits = (url, callback) => $.get(url, callback);

    var creditsPerDay = [];
    var res = await getCredits('/credits/overview');
    $('table tbody tr', res).each(function(){
        var $this = $(this);
        var ffCredits = $('td:nth-child(3)', $this).text().trim().replace(/\./g, "");;
        var ffDate = $('td:nth-child(4)', $this).text().trim();

        creditsPerDay.push({"creditDate": ffDate, "credits": ffCredits});
    });

    creditsPerDay = creditsPerDay.reverse();
    creditsPerDay.shift();

    var checkExistingDate = (getDate) => {
        var funaDate = getDate;

        if (localStorage.getItem("funaDates") === null) {
            localStorage.funaDates = JSON.stringify(["01.01.1970"]);
        }

        var getSavedDates = JSON.parse(localStorage.funaDates);

        if($.inArray(funaDate[0], getSavedDates) >= 0) return true;
        else return false;
    }

    var createOverview = (gotCredits) => {
        var credits = gotCredits;
        $('#funaHelper').html(`<div class="input-group">
                                   <span class="input-group-addon">FunaFuti-Dashboard</span>
                                   <select id="funaSelect" class="form-control"></select>
                                   <span class="input-group-addon alert-danger" id="funaHasBeenSend">Nicht gesendet</span>
                                   <span class="input-group-addon" style="padding:0">
                                   <button type="button" class="btn btn-xs" id="funaSave">
                                       <div class="glyphicon glyphicon-ok"></div>
                                   </button>
                                   </span>
                               </div>`);

        for(var i = 0; i < gotCredits.length; i++){
            $('#funaSelect').append(`<option value="${gotCredits[i].credits}">${gotCredits[i].creditDate}</option>`);
        }

        if(checkExistingDate($.makeArray(creditsPerDay[0].creditDate))) {
            $('#funaHasBeenSend').removeClass('alert-danger').addClass('alert-success');
            $('#funaHasBeenSend').text("Gesendet");
        }
    }

    createOverview(creditsPerDay);

    $('#funaSave').on('click', function(){
        var sendCredits = $('#funaSelect option:selected').val();
        var sendDate = $('#funaSelect option:selected').text().split('.').reverse().join('-');
        var sendUsername = username;
        var germanDate = sendDate.split('-').reverse().join('.');

        if(!checkExistingDate($.makeArray(germanDate))){
          $.post(`https://docs.google.com/forms/d/e/1FAIpQLSfMvXHWbFl4eATFxYPmI4kqhVABldwt_lPHBS4va-EOTYCm_Q/formResponse?entry.2060144052=${sendUsername}&entry.1814145735=${sendCredits}&entry.297423395=${sendDate}&submit=Submit`);

            var savedDates = JSON.parse(localStorage.funaDates);
            savedDates.push(germanDate);
            localStorage.funaDates = JSON.stringify(savedDates);
        } else {
            alert(`Die Daten vom ${germanDate} liegen bereits vor!`);
        }

        $('#funaHasBeenSend').removeClass().addClass('input-group-addon alert-success');
        $('#funaHasBeenSend').text("Gesendet");
    });

    $('#funaSelect').on('change', function(){
        var $this = $(this);
        var selectedDate = $this[0].selectedOptions[0].text;

        if(!checkExistingDate($.makeArray(selectedDate))){
            $('#funaHasBeenSend').removeClass().addClass('input-group-addon alert-danger');
            $('#funaHasBeenSend').text("Nicht gesendet");
        } else {
            $('#funaHasBeenSend').removeClass().addClass('input-group-addon alert-success');
            $('#funaHasBeenSend').text("Gesendet");
        }
    });
})();
