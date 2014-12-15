using EXLibrary.Json;
using EXLibrary.MQ;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZeroMQ;

namespace EXLibrary.MessageQueue.ZeroMQ
{
    public class DataRequestbyZMQ : IDataRequest, IDisposable
    {
        public Guid Id
        {
            get;
            set;
        }

        public string Binding
        {
            get;
            set;
        }

        private ZmqContext Context
        {
            get;
            set;
        }

        private ZmqSocket Responser
        {
            get;
            set;
        }

        private IDictionary<Guid, ZmqSocket> Requesters = new Dictionary<Guid, ZmqSocket>();


        IJsonSerializer _JsonSerializer;
        IJsonSerializer JsonSerializer
        {
            get
            {
                if (this._JsonSerializer == null)
                {
                    this._JsonSerializer = JsonConverter.CreateJsonSerializer();
                }

                return this._JsonSerializer;
            }
        }


        public DataRequestbyZMQ(Guid id)
        {
            this.Id = id;
            Context = ZmqContext.Create();
        }

        public DataRequestbyZMQ(Guid id, string binding)
        {
            this.Binding = binding;
            this.Id = Id;
            Context = ZmqContext.Create();
            Responser = Context.CreateSocket(SocketType.REP);
            Responser.Bind(this.Binding);
            Task.Factory.StartNew(WaitForConnect);
        }

        public void Connect(Guid id, string binding)
        {
            //Task.Factory.StartNew(() =>
            //{
            var requester = Context.CreateSocket(SocketType.REQ);
            requester.Connect(binding);

            var buffer = new Payload();
            buffer.Source = this.Id;
            buffer.Name = "connect";
            buffer.Content = "";

            requester.Send(JsonSerializer.SerializeObject(buffer), Encoding.UTF8);

            var topicBytes = new byte[1024];
            requester.ReceiveTimeout = TimeSpan.FromSeconds(10);
            var topicLenght = requester.Receive(topicBytes);
            if (topicLenght > -1)
            {
                var payload = this.JsonSerializer.Deserialize<Payload>(Encoding.UTF8.GetString(topicBytes, 0, topicLenght));
                if (payload.Name == "connect" && payload.Content == "success")
                {
                    //TODO：记录连接信息
                    this.Requesters.Add(id, requester);
                    return;
                }
            }
            requester.Disconnect(binding);
            //});
        }

        public void Response(Payload buffer)
        {
            this.Responser.Send(JsonSerializer.SerializeObject(buffer), Encoding.UTF8);
        }

        public void Request(Guid Id, string requestMark)
        {
            var payload = new Payload();
            payload.Source = this.Id;
            payload.Name = "request";
            payload.Content = requestMark;

            if (this.Requesters.ContainsKey(Id))
            {
                this.Requesters[Id].Send(JsonSerializer.SerializeObject(payload), Encoding.UTF8);
                var bytes = new byte[1024];
                this.Requesters[Id].ReceiveTimeout = TimeSpan.FromSeconds(10);
                var topicLenght = this.Requesters[Id].Receive(bytes);
                if (topicLenght > -1)
                {
                    this.OnPayloadReceived(JsonSerializer.Deserialize<Payload>(Encoding.UTF8.GetString(bytes, 0, topicLenght)));
                }
            }
            else
            {
                throw new ArgumentNullException();
            }
        }

        public event PayloadEventHandler PayloadReceived;


        #region 内部函数

        private void WaitForConnect()
        {
            while (true)
            {
                var buffer = new byte[1024];
                var length = this.Responser.Receive(buffer);
                var payload = this.JsonSerializer.Deserialize<Payload>(Encoding.UTF8.GetString(buffer, 0, length));
                this.OnPayloadReceived(payload);
            }
        }


        private void OnPayloadReceived(Payload payload)
        {
            if (payload.Name == "connect")
            {
                var payload_success = new Payload();
                payload_success.Source = this.Id;
                payload_success.Name = "connect";
                payload_success.Content = "success";
                this.Response(payload_success);
            }
            else
            {
                if (this.PayloadReceived != null)
                {
                    this.PayloadReceived(payload);
                }
            }
        }
        #endregion


        #region 析构函数部分

        ~DataRequestbyZMQ()
        {
            // In case the client forgets to call
            // Dispose , destructor will be invoked for
            Dispose(false);
        }

        private bool _Disposed = false;
        protected virtual void Dispose(bool disposing)
        {
            if (_Disposed)
            {
                return;
            }

            lock (this)
            {
                if (disposing)  // Free managed objects
                {
                    this.PayloadReceived = null;

                    if (this.Requesters != null)
                    {
                        foreach (var subscriber in this.Requesters.Values)
                        {
                            subscriber.Dispose();
                        }

                        this.Requesters.Clear();
                        this.Requesters = null;
                    }



                    if (this.Responser != null)
                    {
                        this.Responser.Dispose();
                        this.Responser = null;
                    }

                    if (this.Context != null)
                    {
                        this.Context.Dispose();
                        this.Context = null;
                    }
                }

                // Free ummanaged objects
                this._Disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            // Ensure that the destructor is not called
            GC.SuppressFinalize(this);
        }

        #endregion
    }
}
