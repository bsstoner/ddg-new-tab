/***************************
 CRYPTO WIDGET
 **************************/

Vue.component("crypto-price", {
    props: ["current"],
    data() {
        return {
            price: this.current.PRICE.toFixed(2),
            priceChange: this.current.CHANGEPCT24HOUR.toFixed(2)
        }
    },
    template: `
        <div class="d-flex align-items-center mt-3">
            <span class="crypto__price">$\{{ price }}</span>
            <span class="crypto__price-change ml-auto">{{ priceChange }}%</span>
        </div>
    `
});

Vue.component("crypto-chart", {
    props: ["symbol"],
    data() {
        return {
            chartClass: `crypto__chart--${this.symbol.toLowerCase()}`,
            historicalData: {
                series: []
            },
            options: {
                width: '100%',
                height: '100%',
                axisX: {
                    offset: 5,
                    showLabel: false,
                    showGrid: false
                },
                axisY: {
                    offset: 5,
                    showLabel: false,
                    showGrid: false
                },
                chartPadding: 0,
                showPoint: false,
            }
        };
    },
    created() {
        fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${this.symbol}&tsym=USD&limit=24&extraParams=duckduckgo-new-tab-ext`)
            .then(response => {
                return response.json();
            })
            .then(json => {
                this.historicalData.series.push(json.Data.map(obj => { return obj.close }));

                // In the global name space Chartist we call the Line function to initialize a line chart.
                // As a first parameter we pass in a selector where we would like to get our chart created.
                // Second parameter is the actual data object and as a third parameter we pass in our options
                new Chartist.Line(this.$el, this.historicalData, this.options);

            });
    },
    template: `
        <div class="crypto__chart" :class="chartClass"></div>
    `
});

var cryptoWidget = new Vue({
    el: '#crypto-widget',
    data: {
        date: moment().format("MMMM D, YYYY"),
        currencies: ['BTC', 'BCC', 'ETH'],
        currentPrice: null
    },
    created() {
        // get current price info
        fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${this.currencies.join(',')}&tsyms=USD&extraParams=duckduckgo-new-tab-ext`)
          .then(response => {
            return response.json();
          })
          .then(json => {
            this.currentPrice = {};
            this.currencies.forEach(symbol => {
                this.currentPrice[symbol] = json.RAW[symbol].USD;
            });
          });
    }
});

/***************************
 WEATHER WIDGET
 **************************/

 function ddg_spice_forecast(json) {
	console.log(json);
 }

 var weatherWidget = new Vue({
    el: '#weather-widget',
    data: {
		weatherData: null
	},
    created() {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				function onGeoSucces(pos) {
					// get current weather for location
					var lat = pos.coords.latitude;
					var lon = pos.coords.longitude;
					var latLon = encodeURIComponent(`${lat},${lon}`);

					// requires CORS proxy for dev
					// production would use a realy proxy so API key isn't leaked :)
					fetch(`https://api.darksky.net/forecast/${APIKEY}/${latLon}`)
						.then(response => {
							console.log(response);

							return response.json();
						})
						.then(json => {
							console.log(json);
							this.weatherData = json;
						});

				},
				function onGeoError(err) {
					console.log(err);
				});
		} else {
			/* geolocation IS NOT available */
		}
	}
});
