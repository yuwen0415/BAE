using System;
using System.Collections.Generic;
using System.Text;
using NLog;

namespace EXLibrary
{
    public static class LoggerInstance
    {
        static Logger logger = LogManager.GetCurrentClassLogger();
        public static void LogException(LogLevel level, string message, Exception exception)
        {
            logger.LogException(level, message, exception);
        }

        public static void Log(LogLevel level, string message, params object[] args)
        {
            logger.Log(level, message, args);
        }
    }
}
