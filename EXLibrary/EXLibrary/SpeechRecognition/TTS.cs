using System;
using System.Collections.Generic;
using System.Linq;
using System.Speech.Synthesis;
using System.Text;

namespace EXLibrary.SpeechRecognition
{
    public class TTS : IDisposable
    {
        SpeechSynthesizer Speechsyer
        {
            get;
            set;
        }

        bool IsEndOrNot = false;

        public TTS()
        {
            Speechsyer = new SpeechSynthesizer();
            Speechsyer.SpeakCompleted += Speechsyer_SpeakCompleted;
        }



        public void Speach(string text)
        {
            if (!IsEndOrNot)
            {
                IsEndOrNot = true;
                Speechsyer.SpeakAsync(text);
            }
        }

        public event TTSSpeakCompletedEventHandle SpeakCompleted;

        #region 内部实现

        private void Speechsyer_SpeakCompleted(object sender, SpeakCompletedEventArgs e)
        {
            IsEndOrNot = false;
            if (SpeakCompleted != null)
            {
                SpeakCompleted();
            }
        }

        #endregion


        #region Dispose
        private bool disposed = false;

        public void Dispose()
        {
            Dispose(true);
        }
        public void Close()
        {
            Dispose(true);
        }

        ~TTS()
        {
            Dispose(false);
        }

        public void Dispose(bool disposaing)
        {
            if (!this.disposed)
            {
                if (disposaing)
                {
                    //调用所引用对象的dispose（）方法
                    Speechsyer.Dispose();
                }
                //释放非托管资源
                this.disposed = true;
                if (disposaing)
                {
                    GC.SuppressFinalize(this);
                }
            }
        }
        #endregion
    }

    public delegate void TTSSpeakCompletedEventHandle();
}
