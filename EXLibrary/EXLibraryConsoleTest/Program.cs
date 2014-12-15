using EXLibrary.File;
using EXLibrary.File.WordFile;
using EXLibrary.SpeechRecognition;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace EXLibraryConsoleTest
{
    class Program
    {
        static void Main(string[] args)
        {
            //IOfficeFile wordFile = new WordDocumentFile(new FileInfo(@"C:\Users\dell-yuwen\Desktop\WPF绑定.docx"));
            //var wordFileMnt = new WordDocumentFileManagement<WordDocumentFile>(wordFile);
            //wordFileMnt.Show();

            var tts = new TTS();
            tts.SpeakCompleted += tts_SpeakCompleted;
            tts.Speach("今天天气好晴朗，我们一起出去玩吧！！");
            Console.Read();
        }

        private static void tts_SpeakCompleted()
        {
            Console.WriteLine("Completed!");
        }
    }
}
