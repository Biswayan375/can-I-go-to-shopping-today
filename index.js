class FetchDataFromAPI {
    constructor() {
        this.baseAPI = "http://api.openweathermap.org/data/2.5/weather?";
        this.forecastAPI = "http://api.openweathermap.org/data/2.5/forecast?";
        this.units = "metric";
        this.appID = "be92ac8256d49a15937e7e8752051460";
        this.location;
    }

    getWeatherData(location, successCallback, failedCallback) {
        this.setLocation(location);
        let url = `${this.baseAPI}q=${this.location}&appid=${this.appID}&units=${this.units}`;

        $.getJSON(url, function(data){
            successCallback(data);
            // this.getForecast(this.location);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            failedCallback(errorThrown)
        });
    }

    getForecast(location) {
        let url = `${this.forecastAPI}q=${location}&appid=${this.appID}&units=${this.units}`;

        $.getJSON(url, function(data){
            console.log(data);
        });
    }

    setLocation(location) {
        this.location = location;
    }
}

class RequestIOController{
    constructor() {
        this.fetchData = new FetchDataFromAPI();
        this.weatherData;
    }

    init(searchString) {
        this.fetchData.getWeatherData(searchString, (data) => {
            // console.log(data);
            var date = new Date(data.dt*1000).toString().slice(0, 15);
            let iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            htmlString = `<div class='containerHeading'>
            <p>Your Weather Card</p>
            </div>
            <div class='dateInfo'>
                <p>${date}</p>
            </div>
            <div class='locationInfo'>
            <p class='cityName'>${data.name}, </p>
            <span class='countryCode'>${data.sys.country}</span>
            </div>
            <div class='temperatureInfo'>
            <section class='weatherCondition'>
            <p class='temp'>${Math.round(data.main.temp)}&#176;C</p>
            <img src='${iconURL}'>
            </section>
            <p class='weather'>Feels like ${Math.round(data.main.feels_like)}&#176;C.${data.weather[0].main}.${data.weather[0].description}</p>
            
            </div>`;

            $('div.container').html(htmlString);
        }, (error) => {
            if(error == 'Not Found')
                $('div.container').html(`<p style='color: tomato; font-size: 17px; padding-top: 20px'>You may have spelled wrong!</p>`);
            else
                $('div.container').html(`<p style='color: #acacac; font-size: 17px; padding-top: 20px'>Check your connection!</p>`);
        });
    }

    handleClick(event, searchString) {
        event.preventDefault();
        this.init(searchString);
    }
}

const controller = new RequestIOController();
$('div.container').html('<p style="color: grey; padding-top: 20px">LOADING...</p>');
controller.init('Kolkata');

$('button.submitButton').on({
    'click': function(event){
        $('div.container').html('<p style="color: grey; padding-top: 20px">LOADING...</p>');
        controller.handleClick(event, $('input.inputBox').val().trim());
    },
    'mouseenter': function(){
        $(this).css('cursor', 'pointer');
        $(this).fadeTo('slow', 0.6);
    },
    'mouseleave': function(){
        $(this).css('cursor', 'pointer');
        $(this).fadeTo('fast', 1);
    }
});