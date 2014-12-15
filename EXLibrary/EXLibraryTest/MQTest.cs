using EXLibrary;
using EXLibrary.File;
using EXLibrary.IP;
using EXLibrary.MessageQueue.ZeroMQ;
using EXLibrary.MQ;
using EXLibrary.Parallel;
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
    public class MQTest
    {
        [TestMethod]
        public void TestGetIP()
        {
            var Ip = IPHelper.GetLocalHostIP();

            List<IPAddress> ipAddrs = Dns.GetHostEntry(Dns.GetHostName())
                                  .AddressList
                                  .Where(i => i.IsIPv6LinkLocal == false)
                                  .ToList();
        }

        [TestMethod]
        public void TestMQPS()
        {
            var pubId = Guid.NewGuid();
            var pub_exchange = new DataDistributionbyZMQ(pubId, "tcp://127.0.0.1:5556");

            var payload = new Payload();
            payload.Content = "hello";
            payload.Name = "pub";
            payload.Source = Guid.NewGuid();

            var subId = Guid.NewGuid();
            var sub_exchange = new DataDistributionbyZMQ(subId, "tcp://127.0.0.1:5557");
            sub_exchange.PayloadReceived += sub_exchange_PayloadReceived;
            sub_exchange.Connect(pubId, "tcp://127.0.0.1:5556");

            pub_exchange.Publish(payload);
        }

        private void sub_exchange_PayloadReceived(Payload buffer)
        {
            Assert.AreEqual(buffer.Content, "hello");
        }


        IDataRequest Requester
        {
            get;
            set;
        }

        [TestMethod]
        public void TestMQPQ()
        {
            var id = Guid.NewGuid();
            Requester = new DataRequestbyZMQ(id);
            var endId = Guid.Parse("D7B733F7-E9A1-4941-BF50-0B90B5C244FE");
            //  var endId2 = Guid.Parse("FE26728A-6B6F-406D-BE95-FE394B317A04");
            Requester.Connect(endId, "tcp://127.0.0.1:5557");
            // Requester.Connect(endId2, "tcp://127.0.0.1:5558");
            Requester.PayloadReceived += requester_PayloadReceived;
            Requester.Request(endId, "hello");
            // Requester.Request(endId2, "hello");
        }

        private void requester_PayloadReceived(Payload buffer)
        {
            if (buffer.Content == "hello")
            {
                Requester.Request(Guid.Parse("D7B733F7-E9A1-4941-BF50-0B90B5C244FE"), "ok");
            }
        }


        [TestMethod]
        public void ParallelTest()
        {

            IParallel ParallelTest = new ParallelMicrosoft();
            var test = new List<int>();
            for (var i = 0; i < 100000; i++)
            {
                test.Add(i);
            }

            StreamWriter w = new StreamWriter(@"D:\\test.txt");
            var errorlist = new List<int>();
            string str = string.Empty;
            string str2 = string.Empty;
            ParallelTest.Start(test, x =>
            {
                str += x + ";";
            });

            //ParallelTest.Start(test, x =>
            //{
            //    str2 += x + ";";
            //});

            //foreach (var t in test)
            //{
            //    str += t + ";";
            //}
            new Task(() =>
            {
                System.Threading.Thread.Sleep(2000);
                ParallelTest.Stop();
            }).Start();
            w.Write(str);
            w.Close();
        }

        [TestMethod]
        public void ReNameFile()
        {
            System.IO.File.Move(@"D:/test.txt", @"D:/test2.txt");
        }

        [TestMethod]
        public void FileStreamTest()
        {
            string fileName = Path.Combine(AppRuntime.ApplicationPath + "ShowFile.txt");
            var stream = new FileStream(fileName, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite);
            StreamWriter sw = new StreamWriter(stream);
            string text = "456";
            sw.WriteLine(text);

            sw.Flush();

            sw.Close();
            stream.Close();
        }


    }

    public class TxtFile : IDocumentFile
    {

        public string Content
        {
            get;
            set;
        }

        public string FileName
        {
            get;
            set;
        }

        public DateTime CreationTime
        {
            get;
            set;
        }

        public DateTime LastWriteTime
        {
            get;
            set;
        }

        public string FileType
        {
            get;
            set;
        }

        public long FileSize
        {
            get;
            set;
        }

        public string FilePath
        {
            get;
            set;
        }

        public string DirectoryName
        {
            get;
            set;
        }

        public string FullName
        {
            get;
            set;
        }


        public string Extension
        {
            get;
            set;
        }
    }
}
