using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NLog;
using System.IO;
using EXLibrary.WindowsService;

namespace EXLibrary.DataHelper
{
    public static class Datahandler
    {
        public class CheckResult
        {
            //public ServerConnection _sc; //客户端连接
            public bool _bol;  // 验证结果
            public string FrmHead;//帧头
            public string CtrlCode;//控制码
            public string SerialNo;//设备序列号
            public string MsgBody;//信息段
            public string CheckCodes;//CRC校验码
            public string FrmEnd;//帧尾
        }

        /// <summary>
        /// 清楚checkresult内的数据，以方便下一次收到消息时的信息储存
        /// </summary>
        /// <param name="cr"></param>
        public static void ClearcheckResult(CheckResult cr)
        {
            cr._bol = false;
            cr.FrmHead = null;//帧头
            cr.CtrlCode = null;//控制码
            cr.SerialNo = null;//设备序列号
            cr.MsgBody = null;//信息段
            cr.CheckCodes = null;//CRC校验码
            cr.FrmEnd = null;//帧尾
            //cr._sc = null;
            //sendCheck = false;
        }

        /// <summary>
        /// 发送时转义
        /// </summary>
        /// <param name="_str">去除帧头和帧尾后的信息段</param>
        /// <returns>返回转义后的信息段</returns>
        public static string SendTransformMessage(string _str)
        {
            string _strhead = null;
            string tempstr = null;
            int lengh = _str.Length / 2;
            if (_str.Length % 2 != 0)
            {
                Console.WriteLine("数据格式不正确");
                LoggerInstance.Log(LogLevel.Info, "数据格式不正确");
                return null;
            }
            for (int i = 0; i < lengh; i++)
            {
                _strhead = _str.Substring(0, 2);
                if (_strhead == "02")
                {
                    _strhead = "1BE7";
                }
                else if (_strhead == "03")
                {
                    _strhead = "1BE8";
                }
                else if (_strhead == "1B")
                {
                    _strhead = "1B00";
                }
                tempstr += _strhead;
                _str = _str.Substring(2, _str.Length - 2);
            }
            return tempstr;
        }

        /// <summary>
        /// 发送时转义
        /// </summary>
        /// <param name="_str">去除帧头和帧尾后的信息段</param>
        /// <returns>返回转义后的信息段</returns>
        public static string RecTransformMessage(string _str)
        {
            if (_str.Length % 2 != 0)
            {
                //MessageBox.Show("待发送信息格式不正确！");
                return null;
            }
            string _strhead = null;
            string tempstr = null;
            int lengh = _str.Length / 2;
            for (int i = 0; i <= lengh; i++)
            {
                if (_str == "")
                {
                    break;
                }
                _strhead = _str.Substring(0, 2);
                if (_strhead == "1B")
                {
                    _strhead = _str.Substring(0, 4);
                    if (_strhead == "1BE7")
                    {
                        _strhead = "02";
                    }
                    else if (_strhead == "1BE8")
                    {
                        _strhead = "03";
                    }
                    else if (_strhead == "1B00")
                    {
                        _strhead = "1B";
                    }
                    _str = _str.Substring(4, _str.Length - 4);
                }
                else
                {
                    _strhead = _str.Substring(0, 2);
                    _str = _str.Substring(2, _str.Length - 2);
                }

                tempstr += _strhead;

            }
            return tempstr;
        }

        /// <summary>
        /// 将字符串转换成字节
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static byte[] ConvertHexToBytes(string value)
        {
            int len = value.Length / 2;
            byte[] ret = new byte[len];
            for (int i = 0; i < len; i++)
                ret[i] = (byte)(Convert.ToInt32(value.Substring(i * 2, 2), 16));
            return ret;
        }

        /// <summary>
        /// 校验CRC
        /// </summary>
        /// <param name="_str"></param>
        /// <returns></returns>
        public static bool CheckCRC(CheckResult cr, string DeviceType = null)
        {
            string _rd = cr.CtrlCode + cr.SerialNo + cr.MsgBody;
            if (DeviceType == "sansi")
            {
                _rd = cr.SerialNo + cr.CtrlCode + cr.MsgBody;
            }

            string _crc = cr.CheckCodes;

            string _newcrc = new CRC_Modbus().crc16(ConvertHexToBytes(_rd), _rd.Length / 2).ToString("X");//ToString("X")转化成为16进制

            _newcrc = _newcrc.PadLeft(4, '0');

            if (_crc == _newcrc)
                return true;
            else
                return false;
        }

        /// <summary>
        /// 从指定的文件名内取出文件的内容
        /// </summary>
        /// <param name="filename"></param>
        /// <returns></returns>
        public static string[] ReadFile(string filename)
        {
            string ascfile = Asc(filename);
            if (filename.Length == 8)
            {
                //filename = @"../../../HNEMP.WebClient/PlayLists/" + filename;
                filename = @"D:/" + filename;
                FileStream stream = new FileStream(filename, FileMode.Open, FileAccess.Read, FileShare.None);
                byte[] data = new byte[stream.Length];
                stream.Read(data, 0, data.Length);
                long x = stream.Length;
                string dyte1 = "";
                for (int i = 0; i < x; i++)
                {
                    dyte1 = (data[i].ToString("X")).PadLeft(2, '0');
                    ascfile += dyte1;
                }
                stream.Close();
            }
            else
            {
                ascfile = filename;
            }
            int len = 1;
            if (ascfile.Length % 2048 != 0)
            {
                len = ascfile.Length / 2048 + 1;
            }
            else
            {
                len = ascfile.Length / 2048;
            }
            string[] _fileContent = new string[len];
            for (int j = 0; j < len; j++)
            {
                _fileContent[j] = ((ascfile.Length - j * 2048) < 2048) ? ascfile.Substring(j * 2048)
                                                                        : ascfile.Substring(j * 2048, 2048);
            }
            return _fileContent;
        }

        public static string[] ReadFile(string filename, string DeviceType = "sansi")
        {
            int contentLength = 2048;
            if (DeviceType == "sansi")
            {
                contentLength *= 2;
            }
            //filename = @"../../../HNEMP.WebClient/PlayLists/" + filename;
            filename = @"D:/" + filename;
            var content = "";
            FileStream stream = new FileStream(filename, FileMode.Open, FileAccess.Read, FileShare.None);
            byte[] data = new byte[stream.Length];
            stream.Read(data, 0, data.Length);
            long x = stream.Length;
            string dyte1 = "";
            for (int i = 0; i < x; i++)
            {
                dyte1 = (data[i].ToString("X")).PadLeft(2, '0');
                content += dyte1;
            }
            stream.Close();
            int len = 1;
            if (content.Length % contentLength != 0)
            {
                len = content.Length / contentLength + 1;
            }
            else
            {
                len = content.Length / contentLength;
            }
            string[] _fileContent = new string[len];
            for (int j = 0; j < len; j++)
            {
                _fileContent[j] = ((content.Length - j * contentLength) < contentLength) ? content.Substring(j * contentLength)
                                                                        : content.Substring(j * contentLength, contentLength);
            }
            return _fileContent;
        }

        /// <summary>
        /// 将信息内的信息进行拆分
        /// </summary>
        /// <param name="msg"></param>
        /// <returns></returns>
        public static CheckResult SplitMsg(string msg)
        {
            CheckResult checkresult = new CheckResult();
            checkresult.FrmHead = msg.Substring(0, 2);
            msg = msg.Substring(2);
            checkresult.FrmEnd = msg.Substring(msg.Length - 2, 2);
            msg = msg.Substring(0, msg.Length - 2);
            msg = RecTransformMessage(msg);

            checkresult.SerialNo = msg.Substring(0, 4);
            checkresult.CtrlCode = msg.Substring(4, 4);
            checkresult.MsgBody = msg.Substring(8, msg.Length - 12);
            checkresult.CheckCodes = msg.Substring(msg.Length - 4, 4);

            return checkresult;
        }

        //public static CheckResult SplitMsg(string msg, ServerConnection sc)
        //{
        //    CheckResult checkresult = new CheckResult();
        //    checkresult._sc = sc;
        //    checkresult.FrmHead = msg.Substring(0, 2);
        //    msg = msg.Substring(2);
        //    checkresult.FrmEnd = msg.Substring(msg.Length - 2, 2);
        //    msg = msg.Substring(0, msg.Length - 2);
        //    msg = RecTransformMessage(msg);

        //    checkresult.CtrlCode = msg.Substring(0, 4);
        //    checkresult.SerialNo = msg.Substring(4, 32);
        //    checkresult.MsgBody = msg.Substring(36, msg.Length - 40);
        //    checkresult.CheckCodes = msg.Substring(msg.Length - 4, 4);

        //    return checkresult;
        //}


        private static bool checkHead(string str)
        {
            bool _result = false;
            if (str.IndexOf("02") == 0) // 判断帧头
            {
                _result = true;
            }
            else
            {
                _result = false;
            }
            return _result;
        }

        /// <summary>
        /// 拆分长数据，排除长度不符合数据
        /// </summary>
        /// <param name="sc"></param>
        /// <param name="str"></param>
        private static bool DataAnalyse(CheckResult cr)
        {
            bool _return = false;
            CheckResult checkresult = cr;
            try
            {
                if (CheckCRC(cr))
                    _return = true;
                else
                {
                    Console.WriteLine("CRC效验码检验失败！");
                    LoggerInstance.Log(LogLevel.Info, "CRC效验码检验失败！");
                    _return = false;
                }
            }
            catch (Exception ex)
            {
                //TODO: CRC效验出错时。。。。
                LoggerInstance.Log(LogLevel.Error, ex.ToString());
            }
            return _return;
        }

        //public static CheckResult DealwithRecMsg(ServerConnection sender)
        //{
        //    CheckResult cr = new CheckResult();
        //    bool crcResult = false;
        //    if (checkHead(sender.strData))
        //    {
        //        cr = SplitMsg(sender.strData, sender);
        //        crcResult = DataAnalyse(cr);
        //        if (!crcResult)
        //        {
        //            ClearcheckResult(cr);
        //        }
        //    }
        //    else
        //    {
        //        LoggerInstance.Log(LogLevel.Error, "帧头出错");
        //    }
        //    sender.strData = "";
        //    return cr;
        //}
        /// <summary>
        /// ASCII码转化
        /// </summary>
        /// <param name="character"></param>
        /// <returns></returns>
        public static string Asc(string character)
        {
            System.Text.ASCIIEncoding asciiEncoding = new System.Text.ASCIIEncoding();
            string _str = null;
            for (int i = 0; i < character.Length; i++)
            {
                int intAsciiCode = (int)asciiEncoding.GetBytes(character)[i];
                _str += intAsciiCode.ToString("X").PadLeft(2, '0');
            }
            return _str;
        }

        public static string AscTostring(string asc)
        {
            string strCharacter = "";
            System.Text.ASCIIEncoding asciiEncoding = new System.Text.ASCIIEncoding();
            for (var i = 0; i < asc.Length; i += 2)
            {
                var asciiCode = Convert.ToInt32(asc.Substring(i, 2), 16);
                byte[] byteArray = new byte[] { (byte)asciiCode };
                strCharacter += asciiEncoding.GetString(byteArray);
            }
            return strCharacter;

        }

        /// <summary>
        /// 将字节数组转化为16进制字符串
        /// </summary>
        /// <param name="arrByte">需转换的字节数组</param>
        /// <param name="reverse">是否需要把得到的字节数组反转，因为Windows操作系统中整形的高低位是反转转之后保存的。</param>
        /// <returns></returns>
        public static string ConvertBytesToHex(byte[] arrByte, bool reverse)
        {
            StringBuilder sb = new StringBuilder();
            if (reverse)
                Array.Reverse(arrByte);
            foreach (byte b in arrByte)
                sb.AppendFormat("{0:x2},", b);
            return sb.ToString().ToUpper();
        }

        public static string ConvertBytesToHex1(byte[] arrByte, bool reverse)
        {
            StringBuilder sb = new StringBuilder();
            if (reverse)
                Array.Reverse(arrByte);
            foreach (byte b in arrByte)
                sb.AppendFormat("{0:x2}", b);
            return sb.ToString().ToUpper();
        }

        /// <summary>
        /// 处理发送回来的数据
        /// </summary>
        /// <param name="sender"></param>
        /// <returns></returns>
        public static CheckResult DealwithRecMsg(string sender)
        {
            CheckResult cr = new CheckResult();
            bool crcResult = false;
            if (checkHead(sender))
            {
                cr = SplitMsg(sender);
                crcResult = DataAnalyse(cr);
                if (!crcResult)
                {
                    ClearcheckResult(cr);
                }
            }
            else
            {
                LoggerInstance.Log(LogLevel.Error, "帧头出错");
            }
            return cr;
        }


        public static byte[] ConvertHexToBytes(string[] hexstring)
        {
            byte[] returnBytes = new byte[hexstring.Length];
            for (int i = 0; i < returnBytes.Length; i++)
                returnBytes[i] = Convert.ToByte(hexstring[i], 16);
            return returnBytes;
        }

    }
}
