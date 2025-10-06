#!/usr/bin/env node

/**
 * Script de test de performance LCP
 * Utilise Lighthouse pour mesurer les métriques de performance
 * 
 * Usage:
 *   node scripts/test-lcp.js [url]
 * 
 * Exemple:
 *   node scripts/test-lcp.js http://localhost:3000
 *   node scripts/test-lcp.js https://www.moviehunt.fr
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuration
const TARGET_URL = process.argv[2] || 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '../lighthouse-reports');

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Configuration Lighthouse
const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance'],
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
  },
};

async function runLighthouse(url, config) {
  console.log(`🚀 Lancement de Lighthouse pour ${url}...`);
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
  });

  const options = {
    logLevel: 'info',
    output: 'html',
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse(url, options, config);

    // Extraire les métriques
    const { lhr } = runnerResult;
    const metrics = lhr.audits.metrics.details.items[0];
    const performanceScore = lhr.categories.performance.score * 100;

    // Afficher les résultats
    console.log('\n📊 Résultats de performance:\n');
    console.log(`Score de performance: ${performanceScore.toFixed(0)}/100`);
    console.log('\n🎯 Métriques Core Web Vitals:');
    console.log(`  LCP (Largest Contentful Paint): ${(metrics.largestContentfulPaint / 1000).toFixed(2)}s`);
    console.log(`  FCP (First Contentful Paint): ${(metrics.firstContentfulPaint / 1000).toFixed(2)}s`);
    console.log(`  TBT (Total Blocking Time): ${metrics.totalBlockingTime.toFixed(0)}ms`);
    console.log(`  CLS (Cumulative Layout Shift): ${metrics.cumulativeLayoutShift.toFixed(3)}`);
    console.log(`  SI (Speed Index): ${(metrics.speedIndex / 1000).toFixed(2)}s`);

    // Évaluation des métriques
    console.log('\n✅ Évaluation:');
    
    const lcpMs = metrics.largestContentfulPaint;
    if (lcpMs <= 2500) {
      console.log(`  LCP: ✅ Bon (${(lcpMs / 1000).toFixed(2)}s <= 2.5s)`);
    } else if (lcpMs <= 4000) {
      console.log(`  LCP: ⚠️  À améliorer (${(lcpMs / 1000).toFixed(2)}s <= 4.0s)`);
    } else {
      console.log(`  LCP: ❌ Mauvais (${(lcpMs / 1000).toFixed(2)}s > 4.0s)`);
    }

    const fcpMs = metrics.firstContentfulPaint;
    if (fcpMs <= 1800) {
      console.log(`  FCP: ✅ Bon (${(fcpMs / 1000).toFixed(2)}s <= 1.8s)`);
    } else if (fcpMs <= 3000) {
      console.log(`  FCP: ⚠️  À améliorer (${(fcpMs / 1000).toFixed(2)}s <= 3.0s)`);
    } else {
      console.log(`  FCP: ❌ Mauvais (${(fcpMs / 1000).toFixed(2)}s > 3.0s)`);
    }

    const tbt = metrics.totalBlockingTime;
    if (tbt <= 200) {
      console.log(`  TBT: ✅ Bon (${tbt.toFixed(0)}ms <= 200ms)`);
    } else if (tbt <= 600) {
      console.log(`  TBT: ⚠️  À améliorer (${tbt.toFixed(0)}ms <= 600ms)`);
    } else {
      console.log(`  TBT: ❌ Mauvais (${tbt.toFixed(0)}ms > 600ms)`);
    }

    const cls = metrics.cumulativeLayoutShift;
    if (cls <= 0.1) {
      console.log(`  CLS: ✅ Bon (${cls.toFixed(3)} <= 0.1)`);
    } else if (cls <= 0.25) {
      console.log(`  CLS: ⚠️  À améliorer (${cls.toFixed(3)} <= 0.25)`);
    } else {
      console.log(`  CLS: ❌ Mauvais (${cls.toFixed(3)} > 0.25)`);
    }

    // Sauvegarder le rapport HTML
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(OUTPUT_DIR, `lighthouse-${timestamp}.html`);
    fs.writeFileSync(reportPath, runnerResult.report);
    console.log(`\n📄 Rapport complet sauvegardé: ${reportPath}`);

    // Sauvegarder les métriques en JSON
    const metricsPath = path.join(OUTPUT_DIR, `metrics-${timestamp}.json`);
    const metricsData = {
      url,
      timestamp: new Date().toISOString(),
      performanceScore,
      metrics: {
        lcp: metrics.largestContentfulPaint,
        fcp: metrics.firstContentfulPaint,
        tbt: metrics.totalBlockingTime,
        cls: metrics.cumulativeLayoutShift,
        si: metrics.speedIndex,
      },
    };
    fs.writeFileSync(metricsPath, JSON.stringify(metricsData, null, 2));
    console.log(`📊 Métriques JSON sauvegardées: ${metricsPath}`);

    // Recommandations
    console.log('\n💡 Recommandations principales:');
    const opportunities = lhr.audits;
    
    const topOpportunities = Object.values(opportunities)
      .filter(audit => audit.details && audit.details.type === 'opportunity')
      .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
      .slice(0, 5);

    topOpportunities.forEach((opp, index) => {
      const savings = opp.numericValue ? `(~${(opp.numericValue / 1000).toFixed(2)}s)` : '';
      console.log(`  ${index + 1}. ${opp.title} ${savings}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution de Lighthouse:', error);
  } finally {
    await chrome.kill();
  }
}

// Exécuter le test
(async () => {
  console.log('🔍 Test de performance LCP - MovieHunt\n');
  console.log(`URL cible: ${TARGET_URL}`);
  console.log(`Configuration: Mobile (375x667, 4G)\n`);

  await runLighthouse(TARGET_URL, lighthouseConfig);

  console.log('\n✨ Test terminé!\n');
})();
