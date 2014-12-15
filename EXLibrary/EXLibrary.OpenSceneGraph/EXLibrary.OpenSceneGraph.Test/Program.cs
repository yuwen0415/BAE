using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.OpenSceneGraph.Test
{
    class Program
    {
        static void Main(string[] args)
        {
            ITSViewer.LoadScene("cow.osg");
            ITSViewer.PlayScene();
            Console.Read();
        }
    }
}
