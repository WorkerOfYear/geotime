import functools
from typing import Union, Callable, Any, Type


def singleton(obj: Union[Callable[..., Any], Type[Any]]):
    instances = {}

    @functools.wraps(obj)
    def wrapper(*args, **kwargs):
        if obj not in instances:
            instances[obj] = obj(*args, **kwargs)
        return instances[obj]

    return wrapper
