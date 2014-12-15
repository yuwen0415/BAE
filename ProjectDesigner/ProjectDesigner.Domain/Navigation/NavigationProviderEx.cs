using ProjectDesigner.Navigation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EBA.Helpers;

namespace ProjectDesigner.Domain
{
    public static class NavigationProviderEx
    {
        public static List<NavigatorNode> ResolveNavigatorNodes(this INavigationProvider provider, string layoutName = null, NavigationTargets target = NavigationTargets.Web)
        {
            var nodes = new List<NavigatorNode>();

            var navigators = provider.Navigators.AsQuerybale.ToList();

            foreach (var root in navigators.Where(i => i.Parent == null))
            {
                var node = BuildNode(root, navigators);
                nodes.Add(node);
            }


            //移除无子项的，并且本身不带连接的节点。
            foreach (var node in nodes.ToArray())
            {
                RemoveEmtpyNode(node, target);

                if (RemoveNodeOrNot(node, target))
                {
                    nodes.Remove(node);
                }
            }

            return nodes;
        }

        private static bool RemoveNodeOrNot(NavigatorNode node, NavigationTargets target)
        {
            bool flag = false;
            switch (target)
            {
                case NavigationTargets.Wap:
                    if (node.ChildNodes.Count == 0 && node.WapLink.HasValue() == false)
                    {
                        flag = true;
                    }
                    break;
                case NavigationTargets.Win:
                    if (node.ChildNodes.Count == 0 && node.WinLink.HasValue() == false)
                    {
                        flag = true;
                    }
                    break;

                default:
                    if (node.ChildNodes.Count == 0 && node.WebLink.HasValue() == false)
                    {
                        flag = true;
                    }
                    break;
            }
            return flag;
        }

        private static void RemoveEmtpyNode(NavigatorNode node, NavigationTargets target)
        {
            switch (target)
            {
                case NavigationTargets.Wap:
                    node.ChildNodes.RemoveAll(i => i.ChildNodes.Count == 0 && i.WapLink.HasValue() == false);
                    break;
                case NavigationTargets.Win:
                    node.ChildNodes.RemoveAll(i => i.ChildNodes.Count == 0 && i.WinLink.HasValue() == false);
                    break;

                default:
                    node.ChildNodes.RemoveAll(i => i.ChildNodes.Count == 0 && i.WebLink.HasValue() == false);
                    break;
            }

            foreach (var child in node.ChildNodes.ToArray())
            {
                RemoveEmtpyNode(child, target);
                if (child.ChildNodes.Count == 0)
                {
                    switch (target)
                    {
                        case NavigationTargets.Wap:
                            if (child.WapLink.HasValue() == false)
                            {
                                node.ChildNodes.Remove(child);
                            }
                            break;
                        case NavigationTargets.Win:
                            if (child.WinLink.HasValue() == false)
                            {
                                node.ChildNodes.Remove(child);
                            }
                            break;

                        default:
                            if (child.WebLink.HasValue() == false)
                            {
                                node.ChildNodes.Remove(child);
                            }
                            break;
                    }

                }
            }


        }

        private static NavigatorNode BuildNode(INavigator navigator, List<INavigator> navigators)
        {
            var node = new NavigatorNode()
            {
                Id = navigator.Id,
                Name = navigator.Name,
                WapLink = navigator.WapLink,
                WebLink = navigator.WebLink,
                WinLink = navigator.WinLink,
                Parameters = navigator.Parameters,
                IconFile = navigator.IconFile
            };


            foreach (var child in navigators.Where(i => i.Parent != null && i.Parent.Id == navigator.Id))
            {
                node.ChildNodes.Add(BuildNode(child, navigators));
            }


            return node;
        }
    }
}
