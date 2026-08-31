import { RotateCcw, Clock, IndianRupee, ShieldCheck } from "lucide-react";

import "../css/settings.css";

function Settings() {
  return (
    <div className="settings-page">

      {/* Page Title */}
      <div className="page-title">
        <div>
          <h1>Settings</h1>
          <p>Configure recovery policies and action boundaries.</p>
        </div>
      </div>

      {/* Recovery Policy */}
      <section className="settings-section">

        <div className="section-header">
          <div>
            <h2>Recovery Policy</h2>
            <p>Define how RecoverAI handles recovery actions.</p>
          </div>
        </div>

        <div className="settings-list">

          {/* Maximum Retry Attempts */}
          <div className="setting-item">

            <div className="setting-info">

              <div className="setting-icon">
                <RotateCcw size={19} />
              </div>

              <div>
                <h3>Maximum Retry Attempts</h3>
                <p>
                  Maximum number of automatic retry attempts
                  allowed for a payment.
                </p>
              </div>

            </div>

            <select defaultValue="3">
              <option value="1">1 Attempt</option>
              <option value="2">2 Attempts</option>
              <option value="3">3 Attempts</option>
              <option value="4">4 Attempts</option>
              <option value="5">5 Attempts</option>
            </select>

          </div>

          {/* Retry Interval */}
          <div className="setting-item">

            <div className="setting-info">

              <div className="setting-icon">
                <Clock size={19} />
              </div>

              <div>
                <h3>Retry Interval</h3>
                <p>
                  Waiting time before attempting another payment retry.
                </p>
              </div>

            </div>

            <select defaultValue="5">
              <option value="1">1 Minute</option>
              <option value="5">5 Minutes</option>
              <option value="10">10 Minutes</option>
              <option value="30">30 Minutes</option>
            </select>

          </div>

          {/* High Value Threshold */}
          <div className="setting-item">

            <div className="setting-info">

              <div className="setting-icon">
                <IndianRupee size={19} />
              </div>

              <div>
                <h3>High-Value Threshold</h3>
                <p>
                  Payments above this amount require additional review.
                </p>
              </div>

            </div>

            <select defaultValue="10000">
              <option value="5000">₹5,000</option>
              <option value="10000">₹10,000</option>
              <option value="25000">₹25,000</option>
              <option value="50000">₹50,000</option>
            </select>

          </div>

          {/* Human Approval */}
          <div className="setting-item">

            <div className="setting-info">

              <div className="setting-icon">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h3>Require Human Approval</h3>
                <p>
                  Require approval before executing high-value
                  recovery actions.
                </p>
              </div>

            </div>

            <label className="switch">

              <input type="checkbox" defaultChecked />

              <span className="slider"></span>

            </label>

          </div>

        </div>

      </section>

      {/* Information Section */}

      <section className="settings-section info-section">

        <h2>About Recovery Policies</h2>

        <p>
          These settings define the boundaries within which RecoverAI
          can operate. AI recommendations must pass policy validation
          before a recovery action can be executed.
        </p>

      </section>

      {/* Save Button */}

      <div className="settings-actions">

        <button className="save-settings-button">
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default Settings;
