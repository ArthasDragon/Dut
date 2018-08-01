/**
 *绑定事件
 * @param {Element} domNode   dom节点
 * @param {Function} fn  回调函数
 * @param {String} eventName  事件名
 */
export function addEvent(domNode, fn, eventName) {
	if (domNode.addEventListener) {
		domNode.addEventListener(eventName, fn, false);
	} else if (domNode.attachEvent) {
		domNode.attachEvent("on" + eventName, fn);
	}
}
