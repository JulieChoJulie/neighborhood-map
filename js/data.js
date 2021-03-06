// 'MODEL' for all info for each city.
var canadaData =[
    {
        'name': 'Vancouver',
        'attractions': [
            "Capilano Suspension Bridge",
            "Stanley Park",
            "Granville Island",
            "Chinatown, Vancouver",
            "Robson Street",
            "Gastown",
            "Vancouver Art Gallery",
            "Vancouver Maritime Museum",
            "Museum of Anthropology at UBC",
            "Vancouver Museum",
            "Science World at Telus World of Science"
        ],
        "markers":[],
        'latlng' : [
            {lat: 49.3428609, lng: -123.1149244},
            {lat: 49.30425839999999, lng: -123.14425219999998},
            {lat: 49.27115670000001, lng: -123.13399300000003},
            {lat: 49.2793761, lng: -123.10197700000003},
            {lat: 49.2846045, lng: -123.12482399999999},
            {lat: 49.2828082, lng: -123.10668750000002},
            {lat: 49.2829607, lng: -123.12047150000001},
            {lat: 49.277517, lng: -123.14718299999998},
            {lat: 49.269436, lng: -123.25885},
            {lat: 49.2762611, lng: -123.14452510000001},
            {lat: 49.273376, lng: -123.103834}
        ]
    },
    {
        'name': 'Toronto',
        'attractions': [
            "Rogers Centre",
            "Fort York",
            "Air Canada Centre",
            "Hockey Hall of Fame",
            "CN Tower",
            "Ontario Place",
            "Toronto Eaton Centre",
            "Royal Ontario Museum",
            "St. Lawrence Market",
            "Queen Street West",
            "Bata Shoe Museum",
            "Art Gallery of Ontario",
            "Kensington Market",
            "Casa Loma",
            "Ontario Science Centre",
            "Toronto Zoo",
            "Canada's Wonderland"
        ],
        "markers":[],
        'latlng': [
            {lat: 43.6414378, lng: -79.38935320000002},
            {lat: 43.6373362, lng: -79.40654769999998},
            {lat: 43.6434661, lng: -79.37909890000003},
            {lat: 43.6472722, lng: -79.37769019999996},
            {lat: 43.6425662, lng: -79.38705679999998},
            {lat: 43.62842879999999, lng: -79.41353300000003},
            {lat: 43.6544382, lng: -79.38069940000003},
            {lat: 43.6677097, lng: -79.3947771},
            {lat: 43.648578, lng: -79.37153810000001},
            {lat: 43.64550939999999, lng: -79.41233069999998},
            {lat: 43.6672426, lng: -79.40016600000001},
            {lat: 43.6536066, lng: -79.39251230000002},
            {lat: 43.6545236, lng: -79.40145660000002},
            {lat: 43.6780371, lng: -79.40944389999999},
            {lat: 43.7164069, lng: -79.3391838},
            {lat: 43.817699, lng: -79.1858904},
            {lat: 43.8430176, lng: -79.53946250000001}
        ]
    },
    {
        "name":"Winnipeg",
        "attractions":
            ["Assiniboine Park",
                "Fort Gibraltar",
                "La Maison Gabrielle Roy",
                "Le Musée de Saint-Boniface Museum",
                "Manitoba Children's Museum","Manitoba Museum",
                "Naval Museum of Manitoba",
                "The Fire Fighters Museum",
                "Transcona Historical Museum",
                "The Forks, Winnipeg, Manitoba|The Forks",
                "Upper Fort Garry",
                "Western Canada Aviation Museum",
                "Winnipeg Art Gallery","Winnipeg Railway Museum"
            ],
        "markers":[],
        "latlng":[
            {"lat":49.8702491,"lng":-97.23009389999999},
            {"lat":49.8989845,"lng":-97.12533429999996},
            {"lat":49.8902773,"lng":-97.11101959999996},
            {"lat":49.88779539999999,"lng":-97.12321859999997},
            {"lat":49.8875888,"lng":-97.12818820000001},
            {"lat":49.9000253,"lng":-97.13643890000003},
            {"lat":49.8861207,"lng":-97.13755909999998},
            {"lat":49.903648,"lng":-97.1317952},
            {"lat":49.89532819999999,"lng":-97.00530229999998},
            {"lat":49.8871675,"lng":-97.13135940000001},
            {"lat":49.887988,"lng":-97.13531899999998},
            {"lat":49.895744,"lng":-97.22117700000001},
            {"lat":49.8894208,"lng":-97.15063499999997},
            {"lat":49.888946,"lng":-97.13428669999996}
        ]
    },
    {
        "name":"Ottawa",
        "attractions":[
            "Parliament Hill",
            "National War Memorial (Canada)",
            "Rideau Canal",
            "National Gallery of Canada|National Art Gallery",
            "Chateau Laurier",
            "ByWard Market",
            "Canadian War Museum",
            "Canadian Aviation Museum",
            "Canadian Museum of Nature",
            "Canadian Museum of History",
            "Canadian Museum of Science and Technology",
            "Canada Agriculture Museum",
            "TD Place Stadium",
            "Canadian Tire Centre"
        ],
        "markers":[],
        "latlng":[
            {"lat":45.4235937,"lng":-75.70092899999997},
            {"lat":45.4241684,"lng":-75.69558080000002},
            {"lat":45.3964368,"lng":-75.69205850000003},
            {"lat":45.429535,"lng":-75.69890620000001},
            {"lat":45.4256015,"lng":-75.69536740000001},
            {"lat":45.4288655,"lng":-75.69115929999998},
            {"lat":45.4171032,"lng":-75.71694179999997},
            {"lat":45.458542,"lng":-75.64407699999998},
            {"lat":45.412709,"lng":-75.68851000000001},
            {"lat":45.4301581,"lng":-75.70920060000003},
            {"lat":45.4035099,"lng":-75.61890590000002},
            {"lat":45.3982089,"lng":-75.68346780000002},
            {"lat":45.3875416,"lng":-75.7093198},
            {"lat":45.2969151,"lng":-75.92682300000001}]
    },
    {
        "name":"Montreal",
        "attractions":[
            "Olympic Stadium (Montreal)|Olympic Stadium",
            "Montreal City Hall",
            "Montreal Museum of Fine Arts",
            "McCord Museum",
            "McGill University",
            "Mount Royal",
            "Parc Jean-Drapeau",
            "Underground city, Montreal",
            "Biosphère",
            "Redpath Museum",
            "Canadian Centre for Architecture",
            "La Ronde (amusement park)|La Ronde",
            "Saint Joseph's Oratory",
        ],
        "markers":[],
        "latlng":[
            {"lat":45.5579957,"lng":-73.5518816},
            {"lat":45.5089,"lng":-73.5543},
            {"lat":45.4985219,"lng":-73.57940009999999},
            {"lat":45.504356,"lng":-73.57358599999998},
            {"lat":45.50478469999999,"lng":-73.57715109999998},
            {"lat":45.5071024,"lng":-73.58740710000001},
            {"lat":45.5171,"lng":-73.5336},
            {"lat":45.5020,"lng":-73.5600},
            {"lat":45.5139,"lng":-73.5314},
            {"lat":45.50448309999999,"lng":-73.57751989999997},
            {"lat":45.491066,"lng":-73.578958},
            {"lat":45.5221,"lng":-73.5346},
            {"lat":45.4926,"lng":-73.6183}]
    },
    {
        "name":"Quebec City",
        "attractions":["Musée national des beaux-arts du Québec",
            "Musée de la civilisation",
            "Musée de l'Amérique française",
            "Espace Félix Leclerc",
            "Musée naval de Québec",
            "Choco-Musée Erico",
            "Ursulines of Quebec|Musée des Ursulines de Québec",
            "Plains of Abraham Exhibition Centre",
            "Plains of Abraham Exhibition Centre",
            "Parc Aquarium du Québec",
            "Jardin zoologique du Québec"],
        "markers":[],
        "latlng":[
            {"lat":46.80084129999999,"lng":-71.22486129999999},
            {"lat":46.8152288,"lng":-71.2023284},
            {"lat":46.8140955,"lng":-71.20659},
            {"lat":46.8755679,"lng":-71.09466609999998},
            {"lat":46.8185395,"lng":-71.20006219999999},
            {"lat":46.8103709,"lng":-71.21958280000001},
            {"lat":46.812205,"lng":-71.207741},
            {"lat":46.8015014,"lng":-71.21739680000002},
            {"lat":46.80685500000001,"lng":-71.21308399999998},
            {"lat":46.7516292,"lng":-71.28876200000002},
            {"lat":46.8918905,"lng":-71.30114989999998}
        ]
    },
];

// this is map design model.
var model = {
    style: function(){
        return [
            {
                featureType: 'water',
                stylers: [
                    { color: '#19a0d8' }
                ]
            },{
                featureType: 'administrative',
                elementType: 'labels.text.stroke',
                stylers: [
                    { color: '#ffffff' },
                    { weight: 6 }
                ]
            },{
                featureType: 'administrative',
                elementType: 'labels.text.fill',
                stylers: [
                    { color: '#e85113' }
                ]
            },{
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [
                    { color: '#efe9e4' },
                    { lightness: -40 }
                ]
            },{
                featureType: 'transit.station',
                stylers: [
                    { weight: 9 },
                    { hue: '#e85113' }
                ]
            },{
                featureType: 'road.highway',
                elementType: 'labels.icon',
                stylers: [
                    { visibility: 'off' }
                ]
            },{
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [
                    { lightness: 100 }
                ]
            },{
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [
                    { lightness: -100 }
                ]
            },{
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [
                    { visibility: 'on' },
                    { color: '#f0e4d3' }
                ]
            },{
                featureType: 'road.highway',
                elementType: 'geometry.fill',
                stylers: [
                    { color: '#efe9e4' },
                    { lightness: -25 }
                ]
            }
        ];
    }
};