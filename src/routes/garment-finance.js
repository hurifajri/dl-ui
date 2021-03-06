module.exports = [
    {
        route: '/garment-finance/garment-purchasing-to-verification',
        name: 'garment-purchasing-to-verification',
        moduleId: './modules/garment-finance/garment-purchasing-to-verification/index',
        nav: true,
        title: 'Ekspedisi Penyerahan ke Verifikasi',
        auth: true,
        settings: {
            group: "g-finance",
            permission: { "B11": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: '/garment-finance/garment-purchasing-document-expedition-acceptance',
        name: 'garment-purchasing-document-expedition-acceptance',
        moduleId: './modules/garment-finance/garment-purchasing-document-expedition-acceptance/index',
        nav: true,
        title: 'Penerimaan Dokumen Pembelian Garment',
        auth: true,
        settings: {
            group: "g-finance",
            permission: { "B13": 1, "C9": 1, "B12": 1, "B11": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: '/garment-finance/garment-purchasing-verification',
        name: 'garment-purchasing-verification',
        moduleId: './modules/garment-finance/garment-purchasing-verification/index',
        nav: true,
        title: 'Verifikasi Nota Intern',
        auth: true,
        settings: {
            group: "g-finance",
            permission: { "B13": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: '/garment-finance/garment-purchasing-expedition-report',
        name: 'garment-purchasing-expedition-report',
        moduleId: './modules/garment-finance/garment-purchasing-expedition-report/index',
        nav: true,
        title: 'Laporan Ekspedisi Pembelian Garment',
        auth: true,
        settings: {
            group: "g-finance",
            permission: { "B13": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {
      route: "/garment-finance/garment-bank-expenditure-note-dpp-ppn-report",
      name: "garment-bank-expenditure-note-dpp-ppn-report",
      moduleId:
        "./modules/garment-finance/garment-bank-expenditure-note-dpp-ppn-report/index",
      nav: true,
      title: "Laporan Bukti Pengeluaran Bank DPP + PPN",
      auth: true,
      settings: {
        group: "g-finance",
        permission: { "B13": 1, "C9": 1 },
        iconClass: 'fa fa-dashboard'
      },
    },
    {
      route: "/garment-finance/garment-pph-bank-expenditure-note-report",
      name: "garment-pph-bank-expenditure-note-report",
      moduleId: "./modules/garment-finance/garment-pph-bank-expenditure-note-report/index",
      nav: true,
      title: "Laporan Pengajuan Pembayaran PPH",
      auth: true,
      settings: {
        group: "g-finance",
        permission: { "B13": 1, "C9": 1 },
        iconClass: 'fa fa-dashboard'
      },
    },
]