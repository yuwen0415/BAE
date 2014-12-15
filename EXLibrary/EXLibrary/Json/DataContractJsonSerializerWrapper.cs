using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;

namespace EXLibrary.Json
{
    /// <summary>
    /// Wrap <see cref="DataContractJsonSerializer"/> into <see cref="IJsonSerialize"/>
    /// </summary>
    public class DataContractJsonSerializerWrapper : IJsonSerializer
    {

        public string Serialize<T>(T instance)
        {
            using (var stream = new MemoryStream())
            {
                var serializer = new DataContractJsonSerializer(typeof(T));
                serializer.WriteObject(stream, instance);
                stream.Position = 0;
                var reader = new StreamReader(stream, Encoding.UTF8);
                return reader.ReadToEnd();
            }
        }

        public string SerializeObject(object instance)
        {
            using (var stream = new MemoryStream())
            {
                var serializer = new DataContractJsonSerializer(instance.GetType());
                serializer.WriteObject(stream, instance);
                stream.Position = 0;
                var reader = new StreamReader(stream, Encoding.UTF8);
                return reader.ReadToEnd();
            }
        }

        public object DeserializeObject(Type type, string json)
        {
            if (string.IsNullOrWhiteSpace(json))
            {
                return null;
            }

            byte[] byteArray = Encoding.UTF8.GetBytes(json);
            using (MemoryStream stream = new MemoryStream(byteArray))
            {
                var serializer = new DataContractJsonSerializer(type);
                return serializer.ReadObject(stream);
            }
        }

        public T Deserialize<T>(string json)
        {
            if (string.IsNullOrWhiteSpace(json))
            {
                return default(T);
            }

            return (T)this.DeserializeObject(typeof(T), json);
        }
    }
}
