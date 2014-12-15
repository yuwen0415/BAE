using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace EXLibrary.OpenSceneGraph.WinformTest
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            ITSViewer.Stop();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            ITSViewer.Initialize(this.Handle);
            ITSViewer.LoadScene("cow.osg");
            ITSViewer.PlayScene();
        }
    }
}
