// ==UserScript==
// @name         LB Crime Recommender
// @namespace    lb.crime.recommender
// @version      0.8
// @description  Highlights the top 3 recommended open roles across all OCs, preferring BtB, then BftP, then levels 9 to 1
// @author       Fox12
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/571777/LB%20Crime%20Recommender.user.js
// @updateURL https://update.greasyfork.org/scripts/571777/LB%20Crime%20Recommender.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================================================
    // CONFIG
    // ==================================================
    const CRIME_CONFIG = {
        // Level 1
        'first aid and abet': { level: 1, defaultThreshold: null },
        'mob mentality': { level: 1, defaultThreshold: null },
        'pet project': { level: 1, defaultThreshold: null },

        // Level 2
        'cash me if you can': { level: 2, defaultThreshold: 75 },
        'best of the lot': { level: 2, defaultThreshold: 75 },

        // Level 3
        'smoke and wing mirrors': { level: 3, defaultThreshold: 75 },
        'market forces': { level: 3, defaultThreshold: 75 },
        'gaslight the way': { level: 3, defaultThreshold: 75 },

        // Level 4
        'snow blind': { level: 4, defaultThreshold: 75 },
        'plucking the lotus petal': { level: 4, defaultThreshold: 75 },
        'stage fright': { level: 4, defaultThreshold: 75 },

        // Level 5
        'guardian angels': { level: 5, defaultThreshold: 75 },
        'honey trap': { level: 5, defaultThreshold: 75 },
        'counter offer': { level: 5, defaultThreshold: 75 },
        'no reserve': { level: 5, defaultThreshold: 75 },

        // Level 6
        'bidding war': { level: 6, defaultThreshold: 75 },
        'leave no trace': { level: 6, defaultThreshold: 75 },
        'sneaky git grab': { level: 6, defaultThreshold: 75 },

        // Level 7
        'blast from the past': {
            level: 7,
            defaultThreshold: 65,
            roleThresholds: {
                'muscle': 80,
                'engineer': 80,
                'bomber': 70,
                'hacker': 40,
                'picklock #1': 60,
                'picklock #2': 0
            }
        },
        'window of opportunity': { level: 7, defaultThreshold: 30 },

        // Level 8
        'break the bank': {
            level: 8,
            defaultThreshold: 50,
            roleThresholds: {
                'muscle #1': 50,
                'muscle #2': 50,
                'muscle #3': 70,
                'thief #1': 0,
                'thief #2': 70,
                'robber': 50
            }
        },
        'stacking the deck': { level: 8, defaultThreshold: 50 },
        'manifest cruelty': { level: 8, defaultThreshold: 50 },
        'clinical precision': { level: 8, defaultThreshold: 50 },

        // Level 9
        'ace in the hole': { level: 9, defaultThreshold: 50 },
        'gone fission': { level: 9, defaultThreshold: 50 }
    };

    const SPECIAL_TIER_CRIMES = {
        'break the bank': {
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
        'blast from the past': {
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
        'clinical precision': {
            tiers: {
                major: [
                    { name: 'imitator', min: 75, weight: 43, order: 1 }
                ],
                core: [
                    { name: 'cleaner', min: 50, weight: 21, order: 1 },
                    { name: 'cat burglar', min: 50, weight: 19, order: 2 },
                    { name: 'assassin', min: 50, weight: 16, order: 3 }
                ]
            }
        },
        'window of opportunity': {
            tiers: {
                major: [
                    { name: 'looter 2', min: 80, weight: 26, order: 1 }
                ],
                core: [
                    { name: 'looter 1', min: 70, weight: 23, order: 1 },
                    { name: 'muscle 1', min: 60, weight: 21, order: 2 },
                    { name: 'engineer', min: 40, weight: 15, order: 3 },
                    { name: 'muscle 2', min: 40, weight: 14, order: 4 }
                ]
            }
        }
    };

    const STYLE_ID = 'lb-crime-recommender-style';
    const SLOT_ATTR = 'data-lb-best-rank';
    const CARD_ATTR = 'data-lb-best-card';
    const BADGE_CLASS = 'lb-best-rank-badge';

    let lastBestKey = '';
    let topCardMoved = false;

    // ==================================================
    // HELPERS
    // ==================================================
    function norm(text) {
        return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    function addStylesOnce() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            [${CARD_ATTR}="1"] {
                box-shadow: 0 0 0 3px rgba(97, 182, 255, 0.7) !important;
                border-radius: 10px !important;
            }

            [${SLOT_ATTR}="1"] {
                position: relative !important;
                outline: 3px solid #61b6ff !important;
                outline-offset: 2px !important;
                border-radius: 6px !important;
                box-shadow: 0 0 16px rgba(97, 182, 255, 0.75) !important;
            }

            [${SLOT_ATTR}="1"] .slotHeader___K2BS_ {
                background: rgba(97, 182, 255, 0.12) !important;
            }

            .${BADGE_CLASS} {
                position: absolute;
                top: -10px;
                left: -10px;
                z-index: 50;
                min-width: 28px;
                height: 28px;
                padding: 0 8px;
                border-radius: 999px;
                display: flex;
                align-items: center;
                justify-content: center;
                font: 700 12px/1 Arial, sans-serif;
                color: #07131d;
                background: #61b6ff;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    function findCrimeCards() {
        return [...document.querySelectorAll('[data-oc-id]')];
    }

    function getCrimeName(card) {
        return norm(card.querySelector('.panelTitle___aoGuV')?.textContent);
    }

    function getCrimeLevel(crimeName) {
        return CRIME_CONFIG[crimeName]?.level ?? 0;
    }

    function isKnownCrime(crimeName) {
        return Object.prototype.hasOwnProperty.call(CRIME_CONFIG, crimeName);
    }

    function isSpecialTierCrime(crimeName) {
        return Object.prototype.hasOwnProperty.call(SPECIAL_TIER_CRIMES, crimeName);
    }

    function getPhaseState(card) {
        if (card.querySelector('[aria-label="recruiting"]')) return 'stalled';
        if (card.querySelector('[aria-label="active"]')) return 'active';
        return 'unknown';
    }

    function parseDurationToHours(text) {
        if (!text) return Number.POSITIVE_INFINITY;

        const lower = text.toLowerCase();
        const days = Number((lower.match(/(\d+)\s+day/) || [])[1] || 0);
        const hours = Number((lower.match(/(\d+)\s+hour/) || [])[1] || 0);
        const minutes = Number((lower.match(/(\d+)\s+minute/) || [])[1] || 0);
        const seconds = Number((lower.match(/(\d+)\s+second/) || [])[1] || 0);

        return (days * 24) + hours + (minutes / 60) + (seconds / 3600);
    }

    function getRemainingHours(card) {
        const timer = card.querySelector('.title___pB5FU[aria-label]');
        return parseDurationToHours(timer?.getAttribute('aria-label'));
    }

    function getSlotBlocks(card) {
        return [...card.querySelectorAll('.wrapper___Lpz_D')].filter(slot =>
            slot.querySelector('.title___UqFNy') &&
            slot.querySelector('.successChance___ddHsR')
        );
    }

    function getRoleName(slot) {
        return norm(slot.querySelector('.title___UqFNy')?.textContent);
    }

    function getDisplayedValue(slot) {
        const valueEl = slot.querySelector('.successChance___ddHsR');
        if (!valueEl) return null;
        const num = Number(valueEl.textContent.trim());
        return Number.isFinite(num) ? num : null;
    }

    function getJoinButton(slot) {
        return slot.querySelector('.joinContainer___huqrk button.torn-btn, .joinButtonContainer___g0jSd button.torn-btn');
    }

    function isOpenSlot(slot) {
        return !!getJoinButton(slot);
    }

    function getThresholdForRole(crimeName, roleName) {
        const crime = CRIME_CONFIG[crimeName];
        if (!crime) return null;

        if (crime.roleThresholds && crime.roleThresholds[roleName] != null) {
            return crime.roleThresholds[roleName];
        }

        return crime.defaultThreshold ?? null;
    }

    function getTierData(crimeName) {
        return SPECIAL_TIER_CRIMES[crimeName]?.tiers || null;
    }

    function getRoleMeta(crimeName, roleName) {
        const tiers = getTierData(crimeName);
        if (!tiers) return null;

        for (const [tierName, roles] of Object.entries(tiers)) {
            const match = roles.find(role => role.name === roleName);
            if (match) {
                return {
                    tier: tierName,
                    min: match.min,
                    weight: match.weight ?? 0,
                    order: match.order
                };
            }
        }

        return null;
    }

    function getTierRank(tierName) {
        if (tierName === 'major') return 4;
        if (tierName === 'carry') return 3;
        if (tierName === 'core') return 2;
        return 1;
    }

    function countFilledRolesByTier(snapshot, tierName) {
        const tiers = getTierData(snapshot.crimeName);
        if (!tiers || !tiers[tierName]) return 0;

        const tierRoleNames = new Set(tiers[tierName].map(role => role.name));
        let count = 0;

        for (const slot of getSlotBlocks(snapshot.card)) {
            const roleName = getRoleName(slot);
            if (!tierRoleNames.has(roleName)) continue;
            if (!isOpenSlot(slot)) count += 1;
        }

        return count;
    }

    function getOverallCrimePriority(crimeName) {
        if (crimeName === 'break the bank') return 1000;
        if (crimeName === 'blast from the past') return 999;
        if (crimeName === 'clinical precision') return 998;
        if (crimeName === 'window of opportunity') return 997;
        return getCrimeLevel(crimeName);
    }

    // ==================================================
    // SNAPSHOT
    // ==================================================
    function buildCrimeSnapshot(card) {
        const crimeName = getCrimeName(card);
        if (!isKnownCrime(crimeName)) return null;

        const slots = getSlotBlocks(card);
        const openSlots = [];
        let filledCount = 0;

        for (const slot of slots) {
            const roleName = getRoleName(slot);
            const actual = getDisplayedValue(slot);

            if (isSpecialTierCrime(crimeName)) {
                const roleMeta = getRoleMeta(crimeName, roleName);
                if (!roleMeta) continue;

                if (isOpenSlot(slot)) {
                    openSlots.push({
                        slot,
                        roleName,
                        actual,
                        tier: roleMeta.tier,
                        min: roleMeta.min,
                        weight: roleMeta.weight,
                        order: roleMeta.order
                    });
                } else {
                    filledCount += 1;
                }
            } else {
                const threshold = getThresholdForRole(crimeName, roleName);
                if (threshold === null && getCrimeLevel(crimeName) !== 1) continue;

                if (isOpenSlot(slot)) {
                    openSlots.push({
                        slot,
                        roleName,
                        actual,
                        tier: 'fallback',
                        min: threshold ?? 0,
                        weight: 0,
                        order: 1
                    });
                } else {
                    filledCount += 1;
                }
            }
        }

        const snapshot = {
            card,
            crimeName,
            crimeLevel: getCrimeLevel(crimeName),
            crimePriority: getOverallCrimePriority(crimeName),
            phaseState: getPhaseState(card),
            remainingHours: getRemainingHours(card),
            filledCount,
            openSlots,
            isEmptyCrime: filledCount === 0,
            isSpecial: isSpecialTierCrime(crimeName)
        };

        if (snapshot.isSpecial) {
            snapshot.filledReconCount = countFilledRolesByTier(snapshot, 'recon');
            snapshot.filledCoreCount = countFilledRolesByTier(snapshot, 'core');
            snapshot.filledCarryCount = countFilledRolesByTier(snapshot, 'carry');
        } else {
            snapshot.filledReconCount = 0;
            snapshot.filledCoreCount = 0;
            snapshot.filledCarryCount = 0;
        }

        return snapshot;
    }

    function getHighestQualifiedTier(snapshot) {
        const lax = 3;
        const qualifiedOpen = snapshot.openSlots.filter(slot =>
            slot.actual != null && slot.actual >= Math.max(0, slot.min - lax)
        );

        if (qualifiedOpen.some(slot => slot.tier === 'major')) return 'major';
        if (qualifiedOpen.some(slot => slot.tier === 'carry')) return 'carry';
        if (qualifiedOpen.some(slot => slot.tier === 'core')) return 'core';
        if (qualifiedOpen.some(slot => slot.tier === 'recon')) return 'recon';
        return null;
    }

    // ==================================================
    // CANDIDATES
    // ==================================================
    function buildCandidates(snapshot) {
        if (snapshot.isSpecial) {
            const lax = 3;
            const highestQualifiedTier = getHighestQualifiedTier(snapshot);
            if (!highestQualifiedTier) return [];

            const tiers = getTierData(snapshot.crimeName);
            const hasReconTier = !!tiers?.recon;
            if (snapshot.isEmptyCrime && hasReconTier && highestQualifiedTier !== 'recon') {
                return [];
            }

            const targetTier = snapshot.isEmptyCrime
                ? (hasReconTier ? 'recon' : highestQualifiedTier)
                : highestQualifiedTier;

            return snapshot.openSlots
                .filter(slot => slot.tier === targetTier)
                .filter(slot => slot.actual != null && slot.actual >= Math.max(0, slot.min - lax))
                .map(slot => ({
                    card: snapshot.card,
                    slot: slot.slot,
                    crimeName: snapshot.crimeName,
                    crimePriority: snapshot.crimePriority,
                    phaseState: snapshot.phaseState,
                    remainingHours: snapshot.remainingHours,
                    isEmptyCrime: snapshot.isEmptyCrime,
                    roleName: slot.roleName,
                    actual: slot.actual,
                    min: slot.min,
                    weight: slot.weight,
                    tier: slot.tier,
                    roleOrder: slot.order,
                    filledCoreCount: snapshot.filledCoreCount,
                    isSpecial: true
                }));
        }

        return snapshot.openSlots
            .filter(slot => slot.actual != null && slot.actual >= Math.max(0, slot.min - 3))
            .map(slot => ({
                card: snapshot.card,
                slot: slot.slot,
                crimeName: snapshot.crimeName,
                crimePriority: snapshot.crimePriority,
                phaseState: snapshot.phaseState,
                remainingHours: snapshot.remainingHours,
                isEmptyCrime: snapshot.isEmptyCrime,
                roleName: slot.roleName,
                actual: slot.actual,
                min: slot.min,
                weight: slot.weight,
                tier: 'fallback',
                roleOrder: 1,
                filledCoreCount: 0,
                isSpecial: false
            }));
    }

    // ==================================================
    // SORT
    // ==================================================
    function compareCandidates(a, b) {
        // 1. Overall crime priority first
        if (a.crimePriority !== b.crimePriority) {
            return b.crimePriority - a.crimePriority;
        }

        // 2. Within same crime priority, stalled first
        const aStalled = a.phaseState === 'stalled';
        const bStalled = b.phaseState === 'stalled';
        if (aStalled !== bStalled) {
            return aStalled ? -1 : 1;
        }

        // 3. Special handling for BtB / BftP
        if (a.isSpecial !== b.isSpecial) {
            return a.isSpecial ? -1 : 1;
        }

        if (a.isSpecial && b.isSpecial) {
            const tierDiff = getTierRank(b.tier) - getTierRank(a.tier);
            if (tierDiff !== 0) return tierDiff;

            if (a.tier === 'recon' && a.isEmptyCrime !== b.isEmptyCrime) {
                return a.isEmptyCrime ? -1 : 1;
            }

            if (a.tier === 'core' && a.filledCoreCount !== b.filledCoreCount) {
                return a.filledCoreCount - b.filledCoreCount;
            }

            if (a.weight !== b.weight) {
                return b.weight - a.weight;
            }

            if (a.min !== b.min) {
                return b.min - a.min;
            }

            const aHours = Number.isFinite(a.remainingHours) ? a.remainingHours : Number.POSITIVE_INFINITY;
            const bHours = Number.isFinite(b.remainingHours) ? b.remainingHours : Number.POSITIVE_INFINITY;
            if (aHours !== bHours) {
                return aHours - bHours;
            }

            if (a.roleOrder !== b.roleOrder) {
                return a.roleOrder - b.roleOrder;
            }

            return a.roleName.localeCompare(b.roleName);
        }

        // 4. Fallback crimes: highest CPR within current band first
        if (a.actual !== b.actual) {
            return b.actual - a.actual;
        }

        // 5. Then shorter timer
        const aHours = Number.isFinite(a.remainingHours) ? a.remainingHours : Number.POSITIVE_INFINITY;
        const bHours = Number.isFinite(b.remainingHours) ? b.remainingHours : Number.POSITIVE_INFINITY;
        if (aHours !== bHours) {
            return aHours - bHours;
        }

        return a.roleName.localeCompare(b.roleName);
    }

    // ==================================================
    // MARKING
    // ==================================================
    function clearMarks() {
        document.querySelectorAll(`[${CARD_ATTR}]`).forEach(el => {
            el.removeAttribute(CARD_ATTR);
        });

        document.querySelectorAll(`[${SLOT_ATTR}]`).forEach(el => {
            el.removeAttribute(SLOT_ATTR);
        });

        document.querySelectorAll(`.${BADGE_CLASS}`).forEach(el => el.remove());
    }

    function moveCardToTopOnce(card) {
        if (topCardMoved) return;
        const parent = card.parentElement;
        if (!parent) return;

        if (parent.firstElementChild !== card) {
            parent.insertBefore(card, parent.firstElementChild);
        }
        topCardMoved = true;
    }

    function addRankBadge(slot) {
        const badge = document.createElement('div');
        badge.className = BADGE_CLASS;
        badge.textContent = '#1';
        slot.appendChild(badge);
    }

    function markBestCandidate(candidate) {
        clearMarks();
        if (!candidate) return;

        candidate.slot.setAttribute(SLOT_ATTR, '1');
        candidate.slot.title = `${candidate.crimeName} / ${candidate.roleName} / ${candidate.actual} CPR`;
        addRankBadge(candidate.slot);

        candidate.card.setAttribute(CARD_ATTR, '1');

        moveCardToTopOnce(candidate.card);
    }

    function getCandidateKey(candidate) {
        if (!candidate) return '';
        return [
            candidate.crimeName,
            candidate.roleName,
            candidate.actual,
            candidate.phaseState
        ].join('|');
    }

    // ==================================================
    // MAIN
    // ==================================================
    function processAll() {
        addStylesOnce();

        const bestCandidate = findCrimeCards()
            .map(buildCrimeSnapshot)
            .filter(Boolean)
            .flatMap(buildCandidates)
            .sort(compareCandidates)[0] || null;

        const key = getCandidateKey(bestCandidate);
        if (key === lastBestKey) return;

        lastBestKey = key;
        markBestCandidate(bestCandidate);
    }

    // ==================================================
    // SAFE SCHEDULING
    // ==================================================
    let scheduled = false;

    function scheduleProcessAll() {
        if (scheduled) return;
        scheduled = true;

        setTimeout(() => {
            scheduled = false;
            processAll();
        }, 250);
    }

    // ==================================================
    // RUN
    // ==================================================
    setTimeout(processAll, 1200);

    const observer = new MutationObserver((mutations) => {
        // Ignore our own badge/style churn as much as possible
        const relevant = mutations.some(m => {
            const target = m.target;
            return target instanceof Element && !target.closest(`.${BADGE_CLASS}`);
        });

        if (relevant) {
            scheduleProcessAll();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
