export enum LayerType {
  PolyLine,
  Marker
}

export interface Layer {
  icon?: string
  name: string
  isVisible: boolean
  type?: LayerType
  children?: Layer[]
}

export interface Marker extends Layer {
  latlng?: [number, number]
  children?: Marker[]
}

export interface PolyLine extends Layer {}

const patrolis: Marker[] = [
  {
    icon: '/icons/patroli.png',
    name: 'Patroli A',
    isVisible: true,
    children: [
      {
        icon: '/icons/patroli.png',
        name: 'Patroli A1',
        isVisible: true,
        type: LayerType.Marker,
        latlng: [-7.544620952112568, 111.65803323527417]
      },
      {
        icon: '/icons/patroli.png',
        name: 'Patroli A2',
        isVisible: true,
        type: LayerType.Marker,
        latlng: [-7.545264912797669, 111.66000079816824]
      }
    ]
  },
  {
    icon: '/icons/patroli.png',
    name: 'Patroli B',
    isVisible: true,
    children: [
      {
        icon: '/icons/patroli.png',
        name: 'Patroli B1',
        isVisible: true,
        type: LayerType.Marker,
        latlng: [-7.545558284586104, 111.65810122018314]
      },
      {
        icon: '/icons/patroli.png',
        name: 'Patroli B2',
        isVisible: true,
        type: LayerType.Marker,
        latlng: [-7.545946803675345, 111.66139648809836]
      }
    ]
  }
]

const buildings: Marker[] = [
  {
    icon: '/icons/building.png',
    name: 'Gedung A',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544492737967809, 111.65816703315163]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung B',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545512035609023, 111.65811227695143]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung C',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544450518487093, 111.66013825635866]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung D',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.54400419801026, 111.6582461254408]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung E',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544824462315866, 111.65763163919415]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung F',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545855821845761, 111.65735785819317]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung G',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.546832897067643, 111.65677379204777]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung H',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.548280411802121, 111.65773506757047]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung I',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.548304537006544, 111.6588545276634]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung J',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.548382943911637, 111.65956635826592]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung K',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.548256286596348, 111.66078316271474]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung L',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5483588187115895, 111.66150107733952]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung M',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.547146525675781, 111.6616775139846]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung N',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.546579581497707, 111.66185395062969]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung O',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545252687926732, 111.66190870684837]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung P',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.54466161585454, 111.6617991944445]
  },
  {
    icon: '/icons/building.png',
    name: 'Gedung Q',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544559082868209, 111.66114212004562]
  }
]

const sites: Marker[] = [
  {
    icon: '/icons/site.png',
    name: 'Site A',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.543612457003327, 111.65820312168465]
  },
  {
    icon: '/icons/site.png',
    name: 'Site B',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544676315685452, 111.6578720441567]
  },
  {
    icon: '/icons/site.png',
    name: 'Site C',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545581725269017, 111.65773504655895]
  },
  {
    icon: '/icons/site.png',
    name: 'Site D',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.546894565798767, 111.6572898043662]
  },
  {
    icon: '/icons/site.png',
    name: 'Site E',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5478905111284105, 111.65701580917067]
  },
  {
    icon: '/icons/site.png',
    name: 'Site F',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5483432127926715, 111.66087457484109]
  },
  {
    icon: '/icons/site.png',
    name: 'Site G',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.547415173870845, 111.66109148770421]
  },
  {
    icon: '/icons/site.png',
    name: 'Site H',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5465210857088225, 111.66136548289974]
  },
  {
    icon: '/icons/site.png',
    name: 'Site I',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545615678091539, 111.6616166451623]
  },
  {
    icon: '/icons/site.png',
    name: 'Site J',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545174291190928, 111.66167372749472]
  },
  {
    icon: '/icons/site.png',
    name: 'Site K',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544393374801951, 111.660920240707]
  },
  {
    icon: '/icons/site.png',
    name: 'Site L',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.54388408074533, 111.6596872623271]
  }
]

const customers: Marker[] = [
  {
    icon: '/icons/customer.png',
    name: 'Customer A',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.543593042718919, 111.65846626481492]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer B',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.543675439853172, 111.65871774548724]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer C',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.543781077181812, 111.65960219022469]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer D',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5449191914672795, 111.6589042763779]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer E',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545057936528535, 111.65981313163095]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer F',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545378249029589, 111.66115740802651]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer G',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545741383772197, 111.65909952476007]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer H',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5461096568964825, 111.66027447069912]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer I',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.546231272604995, 111.6609828939997]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer J',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5464360321742925, 111.66195043390415]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer K',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.547023426945038, 111.65811321751488]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer L',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5471146097190385, 111.65922097141356]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer M',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.547209756940981, 111.66012077151177]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer N',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.547269223944068, 111.66117653696031]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer O',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.546492187792439, 111.65992481504594]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer P',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.546591299624149, 111.66035271998153]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer Q',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.547554665457036, 111.65726940497652]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer R',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.547951111673592, 111.65892903626879]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer S',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5481691569377665, 111.659872826594]
  },
  {
    icon: '/icons/customer.png',
    name: 'Customer T',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.548264303927681, 111.66043270221066]
  }
]

const odps: Marker[] = [
  {
    icon: '/icons/odp.png',
    name: 'ODP A',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.543612457003327, 111.65820312168465]
  },
  {
    icon: '/icons/odp.png',
    name: 'ODP B',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544676315685452, 111.6578720441567]
  },
  {
    icon: '/icons/odp.png',
    name: 'ODP C',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545581725269017, 111.65773504655895]
  },
  {
    icon: '/icons/odp.png',
    name: 'ODP D',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.546894565798767, 111.6572898043662]
  },
  {
    icon: '/icons/odp.png',
    name: 'ODP E',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5478905111284105, 111.65701580917067]
  },
  {
    icon: '/icons/odp.png',
    name: 'ODP F',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5483432127926715, 111.66087457484109]
  },
  {
    icon: '/icons/odp.png',
    name: 'ODP G',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.547415173870845, 111.66109148770421]
  },
  {
    icon: '/icons/odp.png',
    name: 'ODP H',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5465210857088225, 111.66136548289974]
  },
  {
    icon: '/icons/odp.png',
    name: 'ODP I',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545615678091539, 111.6616166451623]
  },
  {
    icon: '/icons/odp.png',
    name: 'ODP J',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545174291190928, 111.66167372749472]
  },
  {
    icon: '/icons/odp.png',
    name: 'ODP K',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544393374801951, 111.660920240707]
  },
  {
    icon: '/icons/odp.png',
    name: 'ODP L',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.54388408074533, 111.6596872623271]
  }
]

const otbs: Marker[] = [
  {
    icon: '/icons/otb.png',
    name: 'OTB A',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.543612457003327, 111.65820312168465]
  },
  {
    icon: '/icons/otb.png',
    name: 'OTB B',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544676315685452, 111.6578720441567]
  },
  {
    icon: '/icons/otb.png',
    name: 'OTB C',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545581725269017, 111.65773504655895]
  },
  {
    icon: '/icons/otb.png',
    name: 'OTB D',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.546894565798767, 111.6572898043662]
  },
  {
    icon: '/icons/otb.png',
    name: 'OTB E',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5478905111284105, 111.65701580917067]
  },
  {
    icon: '/icons/otb.png',
    name: 'OTB F',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5483432127926715, 111.66087457484109]
  },
  {
    icon: '/icons/otb.png',
    name: 'OTB G',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.547415173870845, 111.66109148770421]
  },
  {
    icon: '/icons/otb.png',
    name: 'OTB H',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5465210857088225, 111.66136548289974]
  },
  {
    icon: '/icons/otb.png',
    name: 'OTB I',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545615678091539, 111.6616166451623]
  },
  {
    icon: '/icons/otb.png',
    name: 'OTB J',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545174291190928, 111.66167372749472]
  },
  {
    icon: '/icons/otb.png',
    name: 'OTB K',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544393374801951, 111.660920240707]
  },
  {
    icon: '/icons/otb.png',
    name: 'OTB L',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.54388408074533, 111.6596872623271]
  }
]

const junctionBoxs: Marker[] = [
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box A',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.543612457003327, 111.65820312168465]
  },
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box B',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544676315685452, 111.6578720441567]
  },
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box C',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545581725269017, 111.65773504655895]
  },
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box D',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.546894565798767, 111.6572898043662]
  },
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box E',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5478905111284105, 111.65701580917067]
  },
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box F',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5483432127926715, 111.66087457484109]
  },
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box G',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.547415173870845, 111.66109148770421]
  },
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box H',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.5465210857088225, 111.66136548289974]
  },
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box I',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545615678091539, 111.6616166451623]
  },
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box J',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545174291190928, 111.66167372749472]
  },
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box K',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.544393374801951, 111.660920240707]
  },
  {
    icon: '/icons/junction-box.png',
    name: 'Junction Box L',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.54388408074533, 111.6596872623271]
  }
]

const handHoles: Marker[] = [
  {
    icon: '/icons/hand-hole.png',
    name: 'Hand Hole A',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.545161836176111, 111.65770530813992]
  },
  {
    icon: '/icons/hand-hole.png',
    name: 'Hand Hole B',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.546349667840485, 111.6574634024166]
  },
  {
    icon: '/icons/hand-hole.png',
    name: 'Hand Hole C',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.548471876040123, 111.66106421083926]
  },
  {
    icon: '/icons/hand-hole.png',
    name: 'Hand Hole D',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.546026934779219, 111.66155747231319]
  },
  {
    icon: '/icons/hand-hole.png',
    name: 'Hand Hole E',
    isVisible: true,
    type: LayerType.Marker,
    latlng: [-7.543943833931344, 111.66001849665783]
  }
]

const assetGroups: Marker[] = [
  {
    name: 'ODP',
    icon: '/icons/odp.png',
    children: odps,
    isVisible: true
  },
  {
    name: 'OTB',
    icon: '/icons/otb.png',
    children: otbs,
    isVisible: true
  },
  {
    name: 'Junction Box',
    icon: '/icons/junction-box.png',
    children: junctionBoxs,
    isVisible: true
  },
  {
    name: 'Hand Hole',
    icon: '/icons/hand-hole.png',
    children: handHoles,
    isVisible: true
  }
]

const cableRoutes: Marker[] = []

const segmentRoutes: Marker[] = []

const routes: Marker[] = [
  {
    name: 'Cable Route',
    icon: '/icons/route.png',
    children: cableRoutes,
    isVisible: true
  },
  {
    name: 'Segment Route',
    icon: '/icons/route.png',
    children: segmentRoutes,
    isVisible: true
  }
]

const fiberMapData = {
  patrolis,
  buildings,
  sites,
  customers,
  assetGroups,
  routes
}

export { fiberMapData }
