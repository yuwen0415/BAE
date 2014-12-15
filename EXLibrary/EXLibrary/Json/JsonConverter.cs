using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Json
{
    /// <summary>
    /// JsonSerializer factory
    /// </summary>
    public static class JsonConverter
    {
        /// <summary>
        /// Create a <see cref="IJsonSerializer"/> instance, returns a <see cref="DataContractJsonSerializerWrapper"/> instance when no implmention is exported as <see cref="IJsonSerialize"/>.
        /// </summary>
        /// <returns></returns>
        public static IJsonSerializer CreateJsonSerializer()
        {
            return new DataContractJsonSerializerWrapper();
        }

    }
}
