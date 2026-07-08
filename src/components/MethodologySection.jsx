import React from 'react';
import { ArrowRight, X, Check } from 'lucide-react';

export default function MethodologySection() {
  return (
    <section className="methodology-section">
      <div className="section-container">
        <div className="methodology-grid">
          {/* Left: narrative text */}
          <div className="methodology-text">
            <h2 className="section-heading">The Philosophy of Demand</h2>
            <p className="section-body">
              Traditional infrastructure planning relies heavily on demographics. It locates 
              wealthy residential postcodes and builds there. In the context of EV charging, 
              this is a trap. Users in wealthy suburbs charge their vehicles at home overnight. 
              Public chargers in these areas remain unutilised.
            </p>
            <p className="section-body" style={{ marginTop: '16px' }}>
              Our approach discards demographics in favour of <strong>behaviour</strong>. By tracking 
              Points of Interest (POIs) like commercial hubs, offices, and major transit routes 
              we capture the exact geography where a vehicle is stationary for an extended period.
            </p>
          </div>

          {/* Right: flowchart diagram */}
          <div className="methodology-diagrams">
            {/* Behavioural Reality (success path) */}
            <div className="flow-card flow-success">
              <div className="flow-header">
                <Check size={14} />
                <span>Behavioural Reality</span>
              </div>
              <div className="flow-steps">
                <div className="flow-step">Point of Interest</div>
                <ArrowRight size={14} className="flow-arrow" />
                <div className="flow-step">Commercial Hub</div>
                <ArrowRight size={14} className="flow-arrow" />
                <div className="flow-step flow-result-good">Public Charger Used</div>
              </div>
            </div>

            {/* Demographic Trap (failure path) */}
            <div className="flow-card flow-danger">
              <div className="flow-header">
                <X size={14} />
                <span>Demographic Trap</span>
              </div>
              <div className="flow-steps">
                <div className="flow-step">Wealthy Postcode</div>
                <ArrowRight size={14} className="flow-arrow" />
                <div className="flow-step">Private Driveways</div>
                <ArrowRight size={14} className="flow-arrow" />
                <div className="flow-step flow-result-bad">Public Charger Sits Empty</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
