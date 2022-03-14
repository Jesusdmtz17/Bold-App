window.boldApp = window.boldApp || {
    dataSales: null,
    strings: {
        summaryInfo: {
            title: "Tus ventas de __*__"
        },
        tooltipFilters: {
            datafono: 'Cobro con datáfono',
            link_pago: 'Cobro con Link de pago',
            all: 'Ver todos',
            applyFilter: 'Aplicar'
        },
        dateFilters:{
            today: 'Hoy',
            week: 'Esta semana',
        },
        salesTable:{
            title: "Tus ventas de __*__",
            transaction: 'Transacción',
            date: 'Fecha y Hora',
            paymentMethod: 'Metodo de pago',
            transactionId: 'ID de la transacción',
            ammount: 'Monto',
            successfulCollect: 'Cobro exitoso',
            unsuccessfulCollect: 'Cobro no Exitoso',
            deduction: 'Deducción de Bold'
        },
        months: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Deciembre"]
    },
    selectors: {
        summaryInfo: {
            title: '.total-sales-title',
            totalPrice: '.total-sales-price',
            date: '.total-sales-date'
        },
        dateFilters: '.container-filters-date',
        tooltipFilters: '.container-filters-type',
        listSales: {
            title: '.list-sales-title',
            table: '.list-sales-table'
        }
        
    },
    getData_BoldApp: function(){
        let data = null;
        async function fetchMoviesJSON() {
            const response = await fetch('./public/javascript/boldApp.json');
            const movies = await response.json();
            return movies;
          }
          fetchMoviesJSON().then(sales => {
            this.dataSales = sales;
          });
        
    },
    getCookie: function(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
        return null;
    },
    setCookie: function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    initDateFilters: function(){
        let currentDate = new Date(),
        currentWeek = currentDate => {
            let oneJan = new Date(currentdate.getFullYear(),0,1);
            let numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
            let result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
            return result;
        },
        currentDay = currentDate.getDay() + 1,
        currentMonth = currentDate.getMonth(),
        currentYear = currentDate.getFullYear() + 1;

        currentFilter = this.getCookie('_current_date_filter') || 'today'

        /*<button class="btn-filter" data-date="today">Hoy</button>
                    <button class="btn-filter" data-date="this-week">Esta semana</button>
                    <button class="btn-filter" data-date="sep">Septiembre</button>*/
        let content = `<div class="filterDate">
                        <input hidden ${currentFilter === 'today' ? 'selected' : ''} name="filter-date" value="today" type="radio" id="todayFilter">
                        <label for="todayFilter">${this.strings.dateFilters.today}</label>
                       </div>
                       <div class="filterDate">
                        <input hidden ${currentFilter === 'thisWeek' ? 'selected' : ''} name="filter-date" value="thisWeek" type="radio" id="thisWeekFilter">
                        <label for="thisWeekFilter">${this.strings.dateFilters.week}</label>
                       </div>
                       <div class="filterDate">
                        <input hidden ${currentFilter === 'thisMonth' ? 'selected' : ''} name="filter-date" value="thisMonth" type="radio" id="thisMonthFilter">
                        <label for="thisMonthFilter">${this.strings.months[currentMonth]}</label>
                       </div>`

        document.querySelector(this.selectors.dateFilters).innerHTML = content;
        
    },
    setEventsListeners: function(){
        document.querySelectorAll(this.selectors.dateFilters + ' input[name="filter-date"]').forEach(element =>{ 
            element.addEventListener('change', event => {
                let selected = event.target.value;
            })
        })
    },
    init: function(){
        this.initDateFilters();
        this.setEventsListeners();

    }
};

boldApp.init();