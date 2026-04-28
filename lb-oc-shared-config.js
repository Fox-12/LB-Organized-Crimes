(function () {
    'use strict';
 
    window.LB_OC_CONFIG = {
        crimeConfig: {
            'first aid and abet': { level: 1, defaultThreshold: null },
            'mob mentality': { level: 1, defaultThreshold: null },
            'pet project': { level: 1, defaultThreshold: null },
 
            'cash me if you can': {
                level: 2,
                roleThresholds: {
                    'thief #1': 80,
                    'thief #2': 75,
                    'lookout': 70
                }
            },
 
            'best of the lot': {
                level: 2,
                roleThresholds: {
                    'muscle': 80,
                    'picklock': 75,
                    'car thief': 70,
                    'imitator': 65
                }
            },
 
            'smoke and wing mirrors': {
                level: 3,
                roleThresholds: {
                    'car thief': 80,
                    'imitator': 75,
                    'hustler #2': 70,
                    'hustler #1': 65
                }
            },
 
            'market forces': {
                level: 3,
                roleThresholds: {
                    'enforcer': 80,
                    'negotiator': 75,
                    'muscle': 70,
                    'lookout': 65,
                    'arsonist': 0
                }
            },
 
            'gaslight the way': {
                level: 3,
                roleThresholds: {
                    'imitator #3': 80,
                    'imitator #2': 75,
                    'looter #3': 70,
                    'imitator #1': 65,
                    'looter #1': 60,
                    'looter #2': 0
                }
            },
 
            'snow blind': {
                level: 4,
                roleThresholds: {
                    'hustler': 80,
                    'imitator': 75,
                    'muscle #1': 70,
                    'muscle #2': 65
                }
            },
 
            'plucking the lotus petal': {
                level: 4,
                roleThresholds: {
                    'muscle': 80,
                    'robber #2': 75,
                    'hustler': 70,
                    'robber #1': 65
                }
            },
 
            'stage fright': {
                level: 4,
                roleThresholds: {
                    'sniper': 80,
                    'muscle #1': 75,
                    'enforcer': 70,
                    'muscle #3': 65,
                    'lookout': 60,
                    'muscle #2': 0
                }
            },
 
            'guardian angels': {
                level: 5,
                roleThresholds: {
                    'hustler': 80,
                    'engineer': 75,
                    'enforcer': 70
                }
            },
 
            'honey trap': {
                level: 5,
                roleThresholds: {
                    'muscle #2': 80,
                    'muscle #1': 75,
                    'enforcer': 70
                }
            },
 
            'counter offer': {
                level: 5,
                roleThresholds: {
                    'robber': 80,
                    'engineer': 75,
                    'picklock': 70,
                    'hacker': 65,
                    'looter': 60
                }
            },
 
            'no reserve': {
                level: 5,
                roleThresholds: {
                    'techie': 80,
                    'engineer': 75,
                    'car thief': 70
                }
            },
 
            'bidding war': {
                level: 6,
                roleThresholds: {
                    'robber #3': 80,
                    'robber #2': 75,
                    'bomber #2': 70,
                    'driver': 65,
                    'bomber #1': 60,
                    'robber #1': 55
                }
            },
 
            'leave no trace': {
                level: 6,
                roleThresholds: {
                    'imitator': 80,
                    'negotiator': 75,
                    'techie': 70
                }
            },
 
            'sneaky git grab': {
                level: 6,
                roleThresholds: {
                    'pickpocket': 80,
                    'imitator': 75,
                    'techie': 70,
                    'hacker': 65
                }
            },
 
            'blast from the past': {
                level: 7,
                priority: 999,
                roleThresholds: {
                    'muscle': 80,
                    'engineer': 80,
                    'bomber': 70,
                    'hacker': 40,
                    'picklock #1': 60,
                    'picklock #2': 0
                },
                tiers: {
                    recon: [
                        { name: 'picklock #2', min: 0, order: 1 }
                    ],
                    core: [
                        { name: 'picklock #1', min: 60, order: 1 },
                        { name: 'hacker', min: 40, order: 2 },
                        { name: 'bomber', min: 70, order: 3 }
                    ],
                    carry: [
                        { name: 'muscle', min: 80, order: 1 },
                        { name: 'engineer', min: 80, order: 2 }
                    ]
                }
            },
 
            'window of opportunity': {
                level: 7,
                priority: 997,
                roleThresholds: {
                    'looter #2': 80,
                    'looter #1': 70,
                    'muscle #1': 60,
                    'engineer': 40,
                    'muscle #2': 40
                },
                tiers: {
                    recon: [],
                    core: [
                        { name: 'looter #1', min: 70, order: 1 },
                        { name: 'muscle #1', min: 60, order: 2 },
                        { name: 'engineer', min: 40, order: 3 },
                        { name: 'muscle #2', min: 40, order: 4 }
                    ],
                    carry: [
                        { name: 'looter #2', min: 80, order: 1 }
                    ]
                }
            },
 
            'thou shalt not steal': {
                level: 7,
                roleThresholds: {
                    'picklock': 80,
                    'pickpocket': 75,
                    'thief': 70
                }
            },
 
            'crane reaction': {
                level: 7,
                roleThresholds: {
                    'sniper': 80,
                    'lookout': 75,
                    'bomber': 70,
                    'muscle #1': 65,
                    'engineer': 60,
                    'muscle #2': 55
                }
            },
 
            'break the bank': {
                level: 8,
                priority: 1000,
                roleThresholds: {
                    'muscle #1': 50,
                    'muscle #2': 50,
                    'muscle #3': 70,
                    'thief #1': 0,
                    'thief #2': 70,
                    'robber': 50
                },
                tiers: {
                    recon: [
                        { name: 'thief #1', min: 0, order: 1 }
                    ],
                    core: [
                        { name: 'muscle #1', min: 50, order: 1 },
                        { name: 'robber', min: 50, order: 2 },
                        { name: 'muscle #2', min: 50, order: 3 }
                    ],
                    carry: [
                        { name: 'muscle #3', min: 70, order: 1 },
                        { name: 'thief #2', min: 70, order: 2 }
                    ]
                }
            },
 
            'stacking the deck': {
                level: 8,
                roleThresholds: {
                    'imitator': 80,
                    'hacker': 75,
                    'cat burglar': 70,
                    'driver': 0
                }
            },
 
            'manifest cruelty': {
                level: 8,
                roleThresholds: {
                    'reviver': 80,
                    'interrogator': 75,
                    'hacker': 70,
                    'cat burglar': 65
                }
            },
 
            'clinical precision': {
                level: 8,
                priority: 998,
                roleThresholds: {
                    'imitator': 75,
                    'cleaner': 50,
                    'cat burglar': 50,
                    'assassin': 50
                },
                tiers: {
                    recon: [],
                    core: [
                        { name: 'cleaner', min: 50, order: 1 },
                        { name: 'cat burglar', min: 50, order: 2 },
                        { name: 'assassin', min: 50, order: 3 }
                    ],
                    carry: [
                        { name: 'imitator', min: 75, order: 1 }
                    ]
                }
            },
 
            'ace in the hole': {
                level: 9,
                roleThresholds: {
                    'hacker': 80,
                    'muscle #2': 75,
                    'imitator': 70,
                    'muscle #1': 65,
                    'driver': 60
                }
            },
 
            'gone fission': {
                level: 9,
                roleThresholds: {
                    'hijacker': 80,
                    'imitator': 75,
                    'bomber': 70,
                    'pickpocket': 65,
                    'engineer': 60
                }
            }
        }
    };
})();
