using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;

namespace ConvertIOSAudioName
{
    class Program
    {
        static void Main(string[] args)
        {
            var doc = new XmlDocument();
            doc.Load(@"C:\Users\surface\Desktop\SoundRecording\AssetManifest.plist");
            var recordings = doc.ChildNodes[2].ChildNodes[0].ChildNodes;
            var fileNames = Directory.GetFiles(@"C:\Users\surface\Desktop\SoundRecording", "*.m4a");
            var files = new Dictionary<string, FileInfo>();
            foreach (var fileName in fileNames)
            {
                files.Add(fileName, new FileInfo(fileName));
            }


            for (var i = 0; i < recordings.Count; i++)
            {
                
            }
            Console.Read();
        }
    }
}
