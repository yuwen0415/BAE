using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NLog;
using System.Timers;

namespace EXLibrary.WindowsService
{
    public abstract class ServerManager
    {
        protected Timer Atime { get; set; }

        public ServerManager()
        {
            this.Atime = new Timer();
            this.Atime.Interval = 5 * 60000;
            this.Atime.Elapsed += new ElapsedEventHandler(TimeEvent);
        }

        public bool CheckDateContext(System.Data.Linq.DataContext _DataContext)
        {
            try
            {
                _DataContext.SubmitChanges();
                return true;
            }
            catch (Exception e)
            {
                LoggerInstance.Log(LogLevel.Error, "数据库连接不正确，原因：" + e.ToString());
                return false;
            }
        }

        public void TimeEvent(object source, ElapsedEventArgs e)
        {
            if (!this.Executing())
            {
                LoggerInstance.Log(LogLevel.Error, "定时时间执行失败！");
            }
        }

        virtual public bool Executing()
        {
            throw new Exception("未对定时处理函数进行重写。");
        }

        public void Start()
        {
            this.Atime.Enabled = true;
            LoggerInstance.Log(LogLevel.Trace, "服务开启");
        }

        public void Stop()
        {
            this.Atime.Enabled = false;
            LoggerInstance.Log(LogLevel.Trace, "服务关闭");
        }

    }
}
