using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace EXLibrary.File
{
    public static class FilesHandler
    {
        /// <summary>
        /// 复制文件夹内的所有文件及文件夹
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        public static void CopyFolder(string from, string to)
        {
            // 子文件夹
            foreach (string sub in Directory.GetDirectories(from))
                CopyFolder(sub + "\\", to + Path.GetFileName(sub) + "\\");

            // 文件
            foreach (string file in Directory.GetFiles(from))
                System.IO.File.Copy(file, to + Path.GetFileName(file), true);
        }


        

    }
}
