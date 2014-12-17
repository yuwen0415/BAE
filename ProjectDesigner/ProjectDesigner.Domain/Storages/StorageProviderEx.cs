using EBA;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Drawing;

namespace ProjectDesigner.Domain.Storages
{
    public static class StorageProviderEx
    {
        static string _Folder;
        private static string Folder
        {
            get
            {
                if (_Folder == null)
                {
                    var Config = AppRuntime.OpenConfiguration();
                    string folder = null;

                    var ebaSectionGroup = Config.GetSectionGroup("eba");
                    if (ebaSectionGroup != null)
                    {
                        var storageSection = ebaSectionGroup.Sections.Get("storage") as StorageConfigurationSection;
                        if (storageSection != null)
                        {
                            folder = storageSection.Path;
                        }
                    }


                    if (string.IsNullOrWhiteSpace(folder))
                    {
                        folder = Path.Combine(AppRuntime.ApplicationPath, "files");
                    }

                    if (Directory.Exists(folder) == false)
                    {
                        Directory.CreateDirectory(folder);
                    }

                    _Folder = folder;

                }

                return _Folder;
            }
        }

        public static string Upload(this IStorageProvider provider, string fileName, byte[] buffer, params string[] tags)
        {

            var file = provider.Files.NewEntity();

            file.Id = Guid.NewGuid().ToString("N");
            file.Name = Path.GetFileNameWithoutExtension(fileName);
            file.FileName = fileName;
            file.Extension = Path.GetExtension(fileName);
            if (tags != null)
            {
                file.Tags = string.Join(",", tags);
            }
            file.UploadedTime = DateTime.Now;

            WriteFile(buffer, file.Id);

            provider.Files.Add(file);
            provider.SubmitChanges();

            return file.Id;
        }

        /// <summary>
        /// 保存文件
        /// </summary>
        /// <param name="buffer">文件内容</param>
        /// <param name="fileId">文件标识</param>
        static void WriteFile(byte[] buffer, string fileId)
        {
            var fullName = Path.Combine(Folder, fileId);

            using (var writer = File.Open(fullName, FileMode.CreateNew))
            {
                writer.Write(buffer, 0, buffer.Length);
                writer.Flush();
            }
        }

        /// <summary>
        /// 获取文件内容
        /// </summary>
        /// <param name="provider">存储数据提供者</param>
        /// <param name="id">文件Id</param>
        /// <returns>返回文件内容字节流</returns>
        public static byte[] GetFileBytes(this IStorageProvider provider, string id)
        {
            var fullName = Path.Combine(Folder, id);
            return ReadFileBytes(fullName);
        }


        private static byte[] ReadFileBytes(string fullName)
        {
            using (var reader = File.OpenRead(fullName))
            {
                byte[] buffer = new byte[reader.Length];

                reader.Read(buffer, 0, buffer.Length);

                return buffer;
            }
        }

        /// <summary>
        /// 生成缩略图
        /// </summary>
        /// <param name="originalImagePath">源图路径（物理路径）</param>
        /// <param name="thumbnailPath">缩略图路径（物理路径）</param>
        /// <param name="height">缩略图高度</param>
        /// <param name="width">缩略图宽度</param>
        /// <returns>返回缩略图文件的存储地址</returns>     
        static string MakeThumbnail(string originalImagePath, string thumbnailPath, int height, int width)
        {
            if (File.Exists(thumbnailPath))
            {
                return thumbnailPath;
            }

            Image originalImage = Image.FromFile(originalImagePath);

            int towidth = width;
            int toheight = height;

            int x = 0;
            int y = 0;
            int ow = originalImage.Width;
            int oh = originalImage.Height;

            if (originalImage.Height * width / originalImage.Width > towidth)
            {
                towidth = originalImage.Width * height / originalImage.Height;
            }
            else
                if (originalImage.Width * height / originalImage.Height > toheight)
                {
                    toheight = originalImage.Height * width / originalImage.Width;
                }

            Image bitmap = new System.Drawing.Bitmap(towidth, toheight);

            Graphics g = System.Drawing.Graphics.FromImage(bitmap);

            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.High;

            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;

            g.Clear(Color.Transparent);

            g.DrawImage(originalImage, new Rectangle(0, 0, towidth, toheight),
                new Rectangle(x, y, ow, oh),
                GraphicsUnit.Pixel);

            try
            {
                bitmap.Save(thumbnailPath, System.Drawing.Imaging.ImageFormat.Jpeg);
            }
            catch (System.Exception e)
            {
                thumbnailPath = "";
                throw e;
            }
            finally
            {
                originalImage.Dispose();
                bitmap.Dispose();
                g.Dispose();
            }
            return thumbnailPath;
        }
    }
}
