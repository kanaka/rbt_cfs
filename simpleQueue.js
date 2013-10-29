/**
 * Created by deepthi on 28/10/13.
 */
//implementing queue operation in js

var queue= [];

function add(element)
{
    queue.push(element);
    return queue;
}

function getNext()
{
    var next=queue.shift();
    return next;
}