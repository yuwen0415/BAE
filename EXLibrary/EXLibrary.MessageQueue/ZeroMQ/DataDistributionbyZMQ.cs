using EXLibrary.Json;
using EXLibrary.MQ;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ZeroMQ;

namespace EXLibrary.MessageQueue.ZeroMQ
{
    public class DataDistributionbyZMQ : IDataDistribution, IDisposable
    {
        ZmqContext Context;
        ZmqSocket Publisher;

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

        public event PayloadEventHandler PayloadReceived;

        public Guid Id
        {
            get;
            set;
        }

        public string Name
        {
            get;
            set;
        }

        public string Binding
        {
            get;
            set;
        }

        public DataDistributionbyZMQ(Guid id)
        {
            this.Id = id;
            Context = ZmqContext.Create();
        }


        public DataDistributionbyZMQ(Guid id, string binding)
        {
            this.Id = id;
            this.Binding = binding;

            Context = ZmqContext.Create();
            Publisher = Context.CreateSocket(SocketType.PUB);
            Publisher.Bind(this.Binding);
        }

        public void Publish(Payload buffer)
        {
            buffer.Source = this.Id;

            var bytes = JsonSerializer.SerializeObject(buffer);

            var envelope = Encoding.UTF8.GetBytes(this.Id.ToString());

            this.Publisher.SendMore(this.Id.ToString(), Encoding.UTF8);
            this.Publisher.SendFrame(new Frame(Encoding.UTF8.GetBytes(bytes)));
        }


        Dictionary<Guid, ZmqSocket> Subscribers = new Dictionary<Guid, ZmqSocket>();

        public void Connect(Guid subId, string binding)
        {
            if (this.Subscribers.ContainsKey(subId) == false)
            {
                lock (this.Subscribers)
                {
                    if (this.Subscribers.ContainsKey(subId) == false)
                    {
                        var subscriber = Context.CreateSocket(SocketType.SUB);

                        subscriber.Connect(binding);

                        subscriber.Subscribe(Encoding.UTF8.GetBytes(subId.ToString()));

                        Task.Factory.StartNew(() =>
                            {
                                while (true)
                                {
                                    try
                                    {
                                        var topicBytes = new byte[1024];
                                        var topicLenght = subscriber.Receive(topicBytes, SocketFlags.SendMore);
                                        var frame = subscriber.ReceiveFrame();
                                        var payload = this.JsonSerializer.Deserialize<Payload>(Encoding.UTF8.GetString(frame.Buffer, 0, frame.BufferSize));
                                        this.OnPayloadReceived(payload);
                                    }
                                    catch
                                    {
                                        //TODO:处理异常
                                    }
                                }
                            }
                            );

                        this.Subscribers.Add(subId, subscriber);
                    }
                }
            }
        }

        public void Disconnect(Guid subId, string binding)
        {
            this.Subscribers[subId].Disconnect(binding);
            this.Subscribers[subId].Dispose();
            this.Subscribers.Remove(subId);
        }

        private void OnPayloadReceived(Payload payload)
        {
            if (this.PayloadReceived != null)
            {
                this.PayloadReceived(payload);
            }
        }

        #region 析构函数部分

        ~DataDistributionbyZMQ()
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

                    if (this.Subscribers != null)
                    {
                        foreach (var subscriber in this.Subscribers.Values)
                        {
                            subscriber.Dispose();
                        }

                        this.Subscribers.Clear();
                        this.Subscribers = null;
                    }

                    if (this.Publisher != null)
                    {
                        this.Publisher.Dispose();
                        this.Publisher = null;
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
