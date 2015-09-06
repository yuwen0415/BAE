using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.DateTimeEx
{
    public static class DataTimeEx
    {
        /// <summary>
        /// 获得该月的天数
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        public static int GetDayofMoth(this DateTime time)
        {
            switch (time.Month)
            {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    return 31;
                case 4:
                case 6:
                case 9:
                case 11:
                    return 30;
                case 2:
                    if ((time.Year % 400 == 0 && time.Year % 3200 != 0)
   || (time.Year % 4 == 0 && time.Year % 100 != 0)
   || (time.Year % 3200 == 0 && time.Year % 172800 == 0))
                    {
                        return 29;
                    }
                    return 28;
            }
            throw new Exception("月份错误！");
        }

        /// <summary>
        /// 判断是不是月底
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        public static bool IsMothEnd(this DateTime time)
        {
            return (time.GetDayofMoth() == time.Day) ? true : false;
        }

        public static DateTime Format(string timeStr)
        {
            //if (timeStr.Contains("年"))
            //{

            //}
            return DateTime.Parse(timeStr);
        }
    }
}
