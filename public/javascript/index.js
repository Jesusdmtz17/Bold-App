window.boldApp = window.boldApp || {
    dataSales: null,
    strings: {
        summaryInfo: {
            title: "Total de ventas de __*__"
        },
        tooltipFilters: {
            title: 'Filtrar',
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
            tableWrapper: '.responsive-table'
        }
        
    },
    getData_BoldApp: function(){
        //function for get data from json file
        async function getJson() {
            let response = await fetch('./public/javascript/boldApp.json', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'GET',
            });
            // you can check for response.ok here, and literally just throw an error if you want
            return await response.json();
        }
        (async () => { 
            const json = await getJson(); 
            this.dataSales = json;
        })();
    },
    getCookie: function(cname) {
        //function to get cookie from browser
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
        //function to set cookie into browser
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getDate : function(date){
        //function to generate date object
        Date.prototype.getWeekNumber = function(){
            var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
            var dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
            return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
          };
        let currentDate;
        if(date){
            currentDate = new Date(date);
        }else{
            currentDate = new Date();
        }
        

        let currentWeek = currentDate => {
            let oneJan = new Date(currentDate.getFullYear(),0,1);
            let numberOfDays = Math.floor((currentDate - oneJan) / (24 * 60 * 60 * 1000));
            let result = Math.ceil(( currentDate.getDay() + 1 + numberOfDays) / 7);
            return result;
        },
        response = {
            currentDay: currentDate.getDate(),
            currentWeek: currentDate.getWeekNumber(),
            currentMonth: currentDate.getMonth(),
            currentYear: currentDate.getFullYear()
        }
        return response;
    },
    initInfo: function(currentFilter, currentTypeFilter){
        //function to init content from json of boldApp, also is used to update view after filter
        let content_title = this.strings.summaryInfo.title,
        table_title = this.strings.salesTable.title, 
        copy_date = '',
        currentDate = this.getDate(),
        totalAmmount = 0,
        totalSalesDate = '';

        let content_table = `<table class="list-sales-table">
                                <thead>
                                    <th>${this.strings.salesTable.transaction}</th>
                                    <th>${this.strings.salesTable.date}</th>
                                    <th>${this.strings.salesTable.paymentMethod}</th>
                                    <th>${this.strings.salesTable.transactionId}</th>
                                    <th>${this.strings.salesTable.ammount}</th>
                                </thead>
                                <tbody>
                                `;
        
        switch(currentFilter){
            case 'today': 
                copy_date = this.strings.dateFilters.today;
                for(cobro in this.dataSales.cobros){
                    let cobroDate = this.getDate(this.dataSales.cobros[cobro].fecha);
                    if(cobroDate.currentDay === currentDate.currentDay && cobroDate.currentMonth === currentDate.currentMonth && cobroDate.currentYear === currentDate.currentYear){
                        switch(currentTypeFilter){
                            case 'datafono':
                                if(this.dataSales.cobros[cobro].metodo_de_pago.tipo === 'datafono'){
                                    if(this.dataSales.cobros[cobro].estado == 'exitoso'){
                                        totalAmmount += parseFloat(this.dataSales.cobros[cobro].monto);
                                    }
                                    content_table += this.setTableRow(this.dataSales.cobros[cobro]);
                                }
                                break;
                            case 'link':
                                if(this.dataSales.cobros[cobro].metodo_de_pago.tipo === 'link de pago'){
                                    if(this.dataSales.cobros[cobro].estado == 'exitoso'){
                                        totalAmmount += parseFloat(this.dataSales.cobros[cobro].monto);
                                    }
                                    content_table += this.setTableRow(this.dataSales.cobros[cobro]);
                                }
                                break;
                            default: 
                                if(this.dataSales.cobros[cobro].estado == 'exitoso'){
                                    totalAmmount += parseFloat(this.dataSales.cobros[cobro].monto);
                                }
                                content_table += this.setTableRow(this.dataSales.cobros[cobro]);
                        }
                    }
                }
                totalSalesDate = `${this.strings.months[currentDate.currentMonth]} ${currentDate.currentDay}`;
                break;
            case 'thisWeek': 
                copy_date = this.strings.dateFilters.week;
                for(cobro in this.dataSales.cobros){
                    let cobroDate = this.getDate(this.dataSales.cobros[cobro].fecha);
                    if(cobroDate.currentWeek === currentDate.currentWeek && cobroDate.currentYear === currentDate.currentYear){
                        switch(currentTypeFilter){
                            case 'datafono':
                                if(this.dataSales.cobros[cobro].metodo_de_pago.tipo === 'datafono'){
                                    if(this.dataSales.cobros[cobro].estado == 'exitoso'){
                                        totalAmmount += parseFloat(this.dataSales.cobros[cobro].monto);
                                    }
                                    content_table += this.setTableRow(this.dataSales.cobros[cobro]);
                                }
                                break;
                            case 'link':
                                if(this.dataSales.cobros[cobro].metodo_de_pago.tipo === 'link de pago'){
                                    if(this.dataSales.cobros[cobro].estado == 'exitoso'){
                                        totalAmmount += parseFloat(this.dataSales.cobros[cobro].monto);
                                    }
                                    content_table += this.setTableRow(this.dataSales.cobros[cobro]);
                                }
                                break;
                            default: 
                                if(this.dataSales.cobros[cobro].estado == 'exitoso'){
                                    totalAmmount += parseFloat(this.dataSales.cobros[cobro].monto);
                                }
                                content_table += this.setTableRow(this.dataSales.cobros[cobro]);
                        }
                    }
                }
                totalSalesDate = `${this.strings.months[currentDate.currentMonth]} ${currentDate.currentDay}`;
                break;
            case 'thisMonth':  
                copy_date = this.strings.months[currentDate.currentMonth];
                for(cobro in this.dataSales.cobros){
                    let cobroDate = this.getDate(this.dataSales.cobros[cobro].fecha);
                    if(cobroDate.currentMonth === currentDate.currentMonth && cobroDate.currentYear === currentDate.currentYear){
                        switch(currentTypeFilter){
                            case 'datafono':
                                if(this.dataSales.cobros[cobro].metodo_de_pago.tipo === 'datafono'){
                                    if(this.dataSales.cobros[cobro].estado == 'exitoso'){
                                        totalAmmount += parseFloat(this.dataSales.cobros[cobro].monto);
                                    }
                                    content_table += this.setTableRow(this.dataSales.cobros[cobro]);
                                }
                                break;
                            case 'link':
                                if(this.dataSales.cobros[cobro].metodo_de_pago.tipo === 'link de pago'){
                                    if(this.dataSales.cobros[cobro].estado == 'exitoso'){
                                        totalAmmount += parseFloat(this.dataSales.cobros[cobro].monto);
                                    }
                                    content_table += this.setTableRow(this.dataSales.cobros[cobro]);
                                }
                                break;
                            default: 
                                if(this.dataSales.cobros[cobro].estado == 'exitoso'){
                                    totalAmmount += parseFloat(this.dataSales.cobros[cobro].monto);
                                }
                                content_table += this.setTableRow(this.dataSales.cobros[cobro]);
                        }
                    }
                }
                totalSalesDate = `${this.strings.months[currentDate.currentMonth]}, ${currentDate.currentYear}`;
                break;
        }
        content_title = content_title.replace('__*__', copy_date);
        table_title = table_title.replace('__*__', copy_date);
        content_table += `</tbody></table>`

        //writing content for summary info
        document.querySelector(this.selectors.summaryInfo.title).innerHTML = content_title;
        document.querySelector(this.selectors.summaryInfo.totalPrice).innerHTML = `$${totalAmmount}`;
        document.querySelector(this.selectors.summaryInfo.date).innerHTML = totalSalesDate;

        //writing content for section sales
        document.querySelector(this.selectors.listSales.title).innerHTML = table_title;
        document.querySelector(this.selectors.listSales.tableWrapper).innerHTML = content_table;

            
    },
    initDateFilters: function(currentFilter){
        //function to write date filters
        let currentDate = this.getDate(),
        currentMonth = currentDate.currentMonth;
        let content = `<div class="filterDate">
                        <input hidden ${currentFilter === 'today' ? 'checked' : ''} name="filter-date" value="today" type="radio" id="todayFilter">
                        <label for="todayFilter">${this.strings.dateFilters.today}</label>
                       </div>
                       <div class="filterDate">
                        <input hidden ${currentFilter === 'thisWeek' ? 'checked' : ''} name="filter-date" value="thisWeek" type="radio" id="thisWeekFilter">
                        <label for="thisWeekFilter">${this.strings.dateFilters.week}</label>
                       </div>
                       <div class="filterDate">
                        <input hidden ${currentFilter === 'thisMonth' ? 'checked' : ''} name="filter-date" value="thisMonth" type="radio" id="thisMonthFilter">
                        <label for="thisMonthFilter">${this.strings.months[currentMonth]}</label>
                       </div>`

        document.querySelector(this.selectors.dateFilters).innerHTML = content;
        
    },
    initTypeFilters: function(currentTypeFilter){
        //function to write type filters
        let content = `<h3 class="title-filter-type">${this.strings.tooltipFilters.title}</h3>
                       <button class="close-filter">×</button>
                       <div class="filtertype">
                        <input ${currentTypeFilter === 'datafono' ? 'checked' : ''} name="filter-type" value="datafono" type="radio" id="datafonoFilter">
                        <label for="datafonoFilter">${this.strings.tooltipFilters.datafono}</label>
                       </div>
                       <div class="filtertype">
                        <input ${currentTypeFilter === 'link' ? 'checked' : ''} name="filter-type" value="link" type="radio" id="linkFilter">
                        <label for="linkFilter">${this.strings.tooltipFilters.link_pago}</label>
                       </div>
                       <div class="filtertype">
                        <input ${currentTypeFilter === 'all' ? 'checked' : ''} name="filter-type" value="all" type="radio" id="allFilter">
                        <label for="allFilter">${this.strings.tooltipFilters.all}</label>
                       </div>
                       <button class="apply-filter">${this.strings.tooltipFilters.applyFilter}</buttton>`;

        document.querySelector(this.selectors.tooltipFilters).innerHTML = content;
    },
    setTableRow: function(row){
        //function to generate table row of sale
        let content = `<tr>
                        <td><span class="icon-${row.metodo_de_pago.tipo === 'datafono' ? 'datafono':'link'}"></span> ${row.estado === 'exitoso' ? this.strings.salesTable.successfulCollect: this.strings.salesTable.unsuccessfulCollect}</td>
                        <td>${row.fecha}</td>
                        <td><span class="icon-${row.metodo_de_pago.franquicia === 'martercard' ? 'mastercard' : 'visa'}"></span> **** **** **** ${ row.metodo_de_pago.numero_de_tarjeta.substr(row.metodo_de_pago.numero_de_tarjeta.length - 4)}</td>
                        <td>${row.id_transaccion}</td>
                        <td><span class="ammount">$${row.monto}</span>
                        ${row.estado === 'exitoso' ? `<span class="deduccion">${this.strings.salesTable.deduction}</span><small class="deduction-ammount">${row.monto * (parseFloat(row.porcentaje_bold/100) )}</small>` : ''}
                        </td>
                       </tr>`
        return content;
    },
    setEventsListeners: function(){
        //function to setup event listeners
        document.querySelectorAll(this.selectors.dateFilters + ' input[name="filter-date"]').forEach(element =>{ 
            element.addEventListener('change', event => {
                let dateSelected = event.target.value,
                typeSelected = document.querySelector(this.selectors.tooltipFilters + ' input[name="filter-type"]:checked').value;

                //reinit portal info
                this.initInfo(dateSelected,typeSelected);

                //set cookie for save session selected
                this.setCookie('_current_date_filter', dateSelected, 1);
            })
        })
        document.addEventListener('click', event => {
                if(event.target.classList.contains('apply-filter')){
                    let typeSelected = document.querySelector(this.selectors.tooltipFilters + ' input[name="filter-type"]:checked').value,
                    dateSelected = document.querySelector(this.selectors.dateFilters + ' input[name="filter-date"]:checked').value;

                    //re-init portal info
                    this.initInfo(dateSelected,typeSelected);

                    //set cookie for save session selected
                    this.setCookie('_current_type_filter', typeSelected, 1);
                }
                if(event.target.classList.contains('title-filter-type')){
                    event.target.closest('.container-filters-type').classList.add('active');
                }
                if(event.target.classList.contains('close-filter')){
                    event.target.closest('.container-filters-type').classList.remove('active');
                }
            })
        
    },
    init: function(){
        //master function
        this.getData_BoldApp(); 
        setTimeout(()=>{
            let currentFilter = this.getCookie('_current_date_filter') || 'today';
            let currentTypeFilter = this.getCookie('_current_type_filter') || 'all';
            this.initInfo(currentFilter, currentTypeFilter);
            this.initDateFilters(currentFilter);
            this.initTypeFilters(currentTypeFilter);
            this.setEventsListeners();
        }, 1000);
    }
};

boldApp.init();