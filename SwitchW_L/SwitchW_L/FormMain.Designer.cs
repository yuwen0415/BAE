namespace SwitchW_L
{
    partial class FormMain
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.txtStatus = new System.Windows.Forms.TextBox();
            this.btnWireless = new System.Windows.Forms.Button();
            this.btnLine = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // txtStatus
            // 
            this.txtStatus.Location = new System.Drawing.Point(12, 28);
            this.txtStatus.Multiline = true;
            this.txtStatus.Name = "txtStatus";
            this.txtStatus.Size = new System.Drawing.Size(374, 145);
            this.txtStatus.TabIndex = 0;
            // 
            // btnWireless
            // 
            this.btnWireless.Location = new System.Drawing.Point(61, 207);
            this.btnWireless.Name = "btnWireless";
            this.btnWireless.Size = new System.Drawing.Size(75, 23);
            this.btnWireless.TabIndex = 1;
            this.btnWireless.Text = "切换成无线网卡";
            this.btnWireless.UseVisualStyleBackColor = true;
            this.btnWireless.Click += new System.EventHandler(this.btnWireless_Click);
            // 
            // btnLine
            // 
            this.btnLine.Location = new System.Drawing.Point(258, 207);
            this.btnLine.Name = "btnLine";
            this.btnLine.Size = new System.Drawing.Size(75, 23);
            this.btnLine.TabIndex = 2;
            this.btnLine.Text = "切换成有线网卡";
            this.btnLine.UseVisualStyleBackColor = true;
            this.btnLine.Click += new System.EventHandler(this.btnLine_Click);
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(398, 262);
            this.Controls.Add(this.btnLine);
            this.Controls.Add(this.btnWireless);
            this.Controls.Add(this.txtStatus);
            this.Name = "FormMain";
            this.Text = "网卡切换工具";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox txtStatus;
        private System.Windows.Forms.Button btnWireless;
        private System.Windows.Forms.Button btnLine;
    }
}

