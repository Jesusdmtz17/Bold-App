window.boldApp = window.boldApp || {
    strings: {
        summaryInfo: {
            title: "Tus ventas de __dateSelected__"
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
            month: 'Septiembre'
        },
        salesTable:{
            title: "Tus ventas de __dateSelected__",
            transaction: 'Transacción',
            date: 'Fecha y Hora',
            paymentMethod: 'Metodo de pago',
            transactionId: 'ID de la transacción',
            ammount: 'Monto',
            successfulCollect: 'Cobro exitoso',
            unsuccessfulCollect: 'Cobro no Exitoso',
            deduction: 'Deducción de Bold'
        }
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
            table: '.list-sales-table',
        }
        
    }
};

