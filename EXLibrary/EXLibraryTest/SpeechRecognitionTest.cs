using EXLibrary;
using EXLibrary.File;
using EXLibrary.IP;
using EXLibrary.MessageQueue.ZeroMQ;
using EXLibrary.MQ;
using EXLibrary.Parallel;
using EXLibrary.SpeechRecognition;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace EXLibraryTest
{
    [TestClass]
    public class SpeechRecognitionTest
    {
        [TestMethod]
        public void TTS()
        {
            var tts = new TTS();
            tts.SpeakCompleted +=tts_SpeakCompleted;
            tts.Speach("今天天气好晴朗，我们一起出去玩吧！！");
        }

        private void tts_SpeakCompleted()
        {
            throw new NotImplementedException();
        }
    }
}
