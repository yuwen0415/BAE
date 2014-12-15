﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Serialization
{
    /// <summary>
    /// Serialize and deserialize object with flat text
    /// </summary>
    public interface ISerializer
    {
        /// <summary>
        /// Serialize instance into JSON.
        /// </summary>
        /// <typeparam name="T">Object type</typeparam>
        /// <param name="instance">object instance</param>
        /// <returns></returns>
        string Serialize<T>(T instance);

        /// <summary>
        /// Serialize instance into JSON.
        /// </summary>
        /// <param name="instance">object instance</param>
        /// <returns></returns>
        string SerializeObject(object instance);

        /// <summary>
        /// Deserialize object with specified type from JSON string.
        /// </summary>
        /// <param name="type">Object type</param>
        /// <param name="content">content string</param>
        /// <returns></returns>
        object DeserializeObject(Type type, string content);

        /// <summary>
        /// Deserialize object with specified type from JSON string.
        /// </summary>
        /// <typeparam name="T">Objec type</typeparam>
        /// <param name="content">JSON string</param>
        /// <returns></returns>
        T Deserialize<T>(string content);
    }
}
