'use client';
import React, { useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

const WORLD_APP_ID = "app_74bd2499a35b025efb62d99125df7883";

declare global {
  interface Window {
    toggleSupportDropdown: any;
    openChatModal: any;
    closeChatModal: any;
    sendChatMessage: any;
    openWithdrawModal: any;
    openUserHistoryModal: any;
    openUserWithdrawalsModal: any;
    openAdminEarningsModal: any;
  }
}

export default function DiceDuelApp() {
  useEffect(() => {
    try {
      MiniKit.install(WORLD_APP_ID);
    } catch (e) {}

    const script = document.createElement('script');
    script.src = '/game-logic.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div id="app">
      <div className="support-container">
        <button className="support-btn-main" onClick={(e: any) => window.toggleSupportDropdown?.(e)}>💬 Support ▼</button>
        <div id="support-dropdown" className="support-dropdown">
          <a href="https://t.me/TNVTEAMWLD" target="_blank" rel="noreferrer" className="support-link">Telegram</a>
          <div className="support-link">Discord <span className="coming-soon">Soon</span></div>
          <div className="support-link">Twitter <span className="coming-soon">Soon</span></div>
        </div>
      </div>

      <div className="chat-toggle-container">
        <button className="chat-btn-main" onClick={() => window.openChatModal?.()}>🌐 Global Chat (<span id="online-count">1</span>)</button>
      </div>

      <header className="topbar">
        <h1 className="brand">TNV Duel Arena 🎲</h1>
        <div className="user-card">Logged in as: <span id="display-username">Tap Play Now to Connect</span></div>
        
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--slate)', marginTop: '6px' }}>
          Progress to Withdraw: <span id="progress-text" style={{ color: 'var(--photon)', fontWeight: 600 }}>0 / 5,000 TNV</span>
        </div>
        <div className="progress-bar"><div id="p-fill" className="progress-fill"></div></div>
        
        <div id="balance-area" style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', marginTop: '8px' }}>
          <div>
            <span>Balance: <span id="balance-num">0</span> TNV</span>
            <button id="withdraw-btn" className="withdraw-btn" disabled onClick={() => window.openWithdrawModal?.()}>WITHDRAW</button>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600 }}>
            Test WLD Balance: <span id="wld-balance-num">100.00</span> WLD
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
          <button className="btn btn-ghost" style={{ fontSize: '10.5px', padding: '6px 12px', border: '1px solid rgba(41,217,194,0.4)', color: 'var(--photon)' }} onClick={() => window.openUserHistoryModal?.()}>📜 Match History</button>
          <button className="btn btn-ghost" style={{ fontSize: '10.5px', padding: '6px 12px', border: '1px solid rgba(41,217,194,0.4)', color: 'var(--photon)' }} onClick={() => window.openUserWithdrawalsModal?.()}>💸 My Withdrawals</button>
          <button id="admin-history-nav-btn" className="btn btn-ghost" style={{ fontSize: '10.5px', padding: '6px 12px', border: '1px solid rgba(243,156,18,0.4)', color: 'var(--gold)', display: 'none' }} onClick={() => window.openAdminEarningsModal?.()}>🛡️ Admin Revenue</button>
        </div>
      </header>

      <main>
        <section id="setup-screen">
          <div className="scanner idle" id="idleScanner" style={{ opacity: 0.5 }}>
            <div className="ring r1"></div><div className="ring r2"></div><div className="ring r3"></div>
            <div className="sweep"></div><div className="core"></div>
          </div>

          <div className="fee-title">Select Entry Amount</div>
          <div className="fee-container">
            {[
              { fee: '0.1', earn: '+0.17' }, { fee: '0.2', earn: '+0.34' }, { fee: '0.5', earn: '+0.80', active: true },
              { fee: '1', earn: '+1.60' }, { fee: '2', earn: '+3.20' }, { fee: '5', earn: '+8.80' },
              { fee: '10', earn: '+17.8' }, { fee: '20', earn: '+36.0' }, { fee: '30', earn: '+54.0' },
              { fee: '40', earn: '+72.0' }, { fee: '50', earn: '+90.0' }
            ].map((item) => (
              <div key={item.fee} className={`fee-chip ${item.active ? 'active' : ''}`} data-fee={item.fee}>
                {item.fee} WLD<span className="chip-earn">{item.earn}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" id="start-btn">PLAY NOW (0.5 WLD)</button>
          
          <div className="rules-card">
            <h3>📖 Game Rules & Rewards</h3>
            <div className="rules-grid">
              <div className="rule-item">• <span>Match Duration:</span> 32 seconds total.</div>
              <div className="rule-item">• <span>Turn Timing:</span> Strictly 2-second cooldown per tap. 15 taps limit.</div>
              <div className="rule-item">• <span>Winner:</span> Higher score wins the WLD pool and TNV coins.</div>
            </div>
          </div>

          <div id="admin-panel" style={{ display: 'none' }}>
            <div className="admin-header"><span>🛡️ ADMIN WITHDRAWAL REQUESTS</span></div>
            <div className="admin-list" id="admin-req-container"></div>
          </div>

          <div id="admin-cheaters-panel" style={{ display: 'none' }}>
            <div className="admin-header"><span>⚠️ AUTO-CLICKER DETECTIONS</span></div>
            <div className="admin-list" id="admin-cheaters-container"></div>
          </div>

          <div className="leaderboard-section">
            <div className="lb-header"><span>⚡ TNV ELITE LEADERBOARD</span></div>
            <div className="lb-list" id="lb-container"></div>
          </div>
        </section>

        <section id="game-screen" style={{ display: 'none' }}>
          <div className="stats-box">
            <div><div className="who" id="my-name-tag">ME</div><div className="score" id="my-score">0</div></div>
            <div id="game-timer">32s</div>
            <div><div className="who" id="opp-name-tag">OPP</div><div className="score" id="opp-score">0</div></div>
          </div>

          <div className="scene" id="dice-scene">
            <div className="cube" id="dice-cube">
              <div className="cube__face front"><span className="pip red"></span></div>
              <div className="cube__face back"><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}><span className="pip"></span><span className="pip"></span></div></div>
              <div className="cube__face right"><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}><span className="pip"></span><span className="pip"></span></div></div>
              <div className="cube__face left"><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}><span className="pip"></span><span className="pip"></span><span className="pip"></span><span className="pip"></span></div></div>
              <div className="cube__face top"><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}><span className="pip"></span><span className="pip"></span></div></div>
              <div className="cube__face bottom"><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}><span className="pip"></span><span className="pip"></span></div></div>
            </div>
          </div>
          <div className="tap-hint" id="turn-indicator">tap the die to roll</div>
        </section>
      </main>

      <div id="chat-modal" className="custom-modal">
        <div className="modal-card chat-card">
          <div className="chat-header">
            <span>💬 Community Global Chat</span>
            <button className="chat-close-btn" onClick={() => window.closeChatModal?.()}>✕</button>
          </div>
          <div id="chat-messages-container" className="chat-messages"></div>
          <div className="chat-input-area">
            <input type="text" id="chat-input-field" className="chat-input" placeholder="Type a message..." maxLength={150} />
            <button className="chat-send-btn" onClick={() => window.sendChatMessage?.()}>Send</button>
          </div>
        </div>
      </div>

      <div id="waiting-overlay">
        <h2 id="wait-status">SEARCHING...</h2>
      </div>

      <div id="result-overlay">
        <div className="result-card" id="result-card">
          <div id="result-icon">🏆</div>
          <h2 id="result-title">VICTORY!</h2>
          <p id="result-msg">Rewards credited</p>
          <button className="btn btn-primary" onClick={() => location.reload()}>PLAY AGAIN</button>
        </div>
      </div>
    </div>
  );
}