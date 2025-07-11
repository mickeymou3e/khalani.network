from typing import Dict, Type
import torch.nn as nn

from simlearn.approaches.models.simple import BallOnlyModel
from simlearn.approaches.models.full import FullModel
from simlearn.approaches.models.ball_anticipation import BallAnticipationModel
from simlearn.approaches.models.spatial_influence import SpatialInfluenceModel
from simlearn.approaches.models.deep import DeepModel
from simlearn.approaches.models.shallow_spatial import ShallowSpatial
from simlearn.approaches.models.shallower_spatial import ShallowerSpatial
from simlearn.approaches.models.adapted_spatial import AdaptedSpatial
from simlearn.approaches.models.goalie_model import GoalieModel
from simlearn.approaches.models.attack import AttackModel
from simlearn.approaches.models.coarse_spatial import CoarseSpatial
from simlearn.approaches.models.triangle import Triangle

class ModelRegistry:
    _models: Dict[str, Type[nn.Module]] = {
        'simple': BallOnlyModel,
        'full': FullModel,
        'ball_anticipation': BallAnticipationModel,
        'spatial_influence': SpatialInfluenceModel,
        'deep': DeepModel,
        'shallow_spatial': ShallowSpatial,
        'shallower_spatial': ShallowerSpatial,
        'goalie': GoalieModel,
        'adapted_spatial': AdaptedSpatial,
        'attack': AttackModel,
        'coarse_spatial': CoarseSpatial,
        'triangle': Triangle,
    }

    @classmethod
    def get_model(cls, model_type: str, **kwargs) -> nn.Module:
        """
        Get a model instance by its type name.
        
        Args:
            model_type: The type/name of the model to instantiate
            **kwargs: Additional arguments to pass to the model constructor
        
        Returns:
            An instance of the requested model
        
        Raises:
            ValueError: If model_type is not registered
        """
        if model_type not in cls._models:
            raise ValueError(
                f"Unknown model type: {model_type}. "
                f"Available models: {list(cls._models.keys())}"
            )
        
        return cls._models[model_type](**kwargs)

    @classmethod
    def register_model(cls, name: str, model_class: Type[nn.Module]):
        """
        Register a new model class.
        
        Args:
            name: Name to register the model under
            model_class: The model class to register
        """
        cls._models[name] = model_class

    @classmethod
    def available_models(cls) -> list:
        """List all available model types."""
        return list(cls._models.keys()) 