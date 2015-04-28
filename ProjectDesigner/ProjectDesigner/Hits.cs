using EBA.Collections;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace ProjectDesigner
{
    public class Hits<TEntity> : IHits, ICollection<TEntity>
    {


        public Hits()
        {
            this.Items = new List<TEntity>();
        }

        public Hits(IEnumerable<TEntity> collection)
        {
            this.Items = new List<TEntity>();
            this.Items.AddRange(collection);
        }

        public int TotalHits
        {
            get;
            set;
        }

        public int TotalPages { get; set; }

        public List<TEntity> Items { get; set; }

        #region ICollection<T> Members

        public void Add(TEntity item)
        {
            Items.Add(item);
        }

        public void Clear()
        {
            this.Items.Clear();
        }

        public bool Contains(TEntity item)
        {
            return Items.Contains(item);
        }

        public void CopyTo(TEntity[] array, int arrayIndex)
        {
            this.Items.CopyTo(array, arrayIndex);
        }

        public int Count
        {
            get
            {
                return this.Items.Count;
            }
        }

        public bool IsReadOnly
        {
            get
            {
                return false;
            }
        }

        public bool Remove(TEntity item)
        {
            return this.Items.Remove(item);
        }

        public TEntity this[int index]
        {
            get
            {
                return this.Items[index];
            }
            set
            {
                this.Items[index] = value;
            }
        }
        #endregion

        #region IEnumerable<T> Members

        public IEnumerator<TEntity> GetEnumerator()
        {
            return this.Items.GetEnumerator();
        }

        #endregion

        #region IEnumerable Members

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.Items.GetEnumerator();
        }

        #endregion


        public Hits<TResult> Select<TResult>(Expression<Func<TEntity, TResult>> selector)
        {
            var hits = new Hits<TResult>(this.Items.Select(selector.Compile()));

            hits.TotalHits = this.TotalHits;

            return hits;
        }
    }

}
