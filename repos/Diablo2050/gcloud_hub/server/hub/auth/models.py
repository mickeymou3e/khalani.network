from sqlalchemy import String, LargeBinary, DateTime, Enum, JSON, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from hub.database import Column, Model, ForeignKey, Table, relationship, backref
import datetime
from authlib.integrations.sqla_oauth2 import (
    OAuth2AuthorizationCodeMixin,
    OAuth2ClientMixin,
    OAuth2TokenMixin,
)

import os
import time



# Association table for many-to-many relationship between User and Organization
user_organizations = Table('user_organization', Model.metadata,
    Column('user_id', UUID(as_uuid=True), ForeignKey('user.id'), primary_key=True),
    Column('organization_id', UUID(as_uuid=True), ForeignKey('organization.id'), primary_key=True)
)

class Organization(Model):
    __tablename__ = "organization"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)

    # default organization is the organization created when a user registers
    default_organization = Column(Boolean, default=True)
    default_organization_of_user = Column(
        UUID(as_uuid=True),
        ForeignKey('user.id', ondelete="cascade"),
        unique=True,
        nullable=True
    )
    user = relationship(
        "User",
        backref=backref("default_organization_of_user", uselist=False)
    )


    # many to many relationship between user roles
    users = relationship("UserRoleAssociation", back_populates="organization")
    # one-to-many relationship with Artifact
    artifacts = relationship("Artifact", backref="organization")

    created_at = Column(DateTime, nullable=True, default=datetime.datetime.utcnow)


class Role(Model):
    __tablename__ = "role"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)


class UserRoleAssociation(Model):
    __tablename__ = "user_role_association"

    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id'), primary_key=True, default=uuid.uuid4)
    role_id = Column(UUID, ForeignKey('role.id'), primary_key=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey('organization.id'), primary_key=True)

    # Relationships
    user = relationship("User", back_populates="roles")
    role = relationship("Role")
    organization = relationship("Organization", back_populates="users")


class User(Model):
    __tablename__ = "user"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, default="MysteriousAnon")
    avatar_url = Column(String, default="", nullable=True)
    github_id = Column(Integer, nullable=True)
    github_node_id = Column(String, nullable=True)
    emails = relationship("Email", backref="user")
    access_tokens = relationship("AccessToken", backref="user")
    refresh_tokens = relationship("RefreshToken", backref="user")
    roles = relationship("UserRoleAssociation", back_populates="user")
    created_at = Column(DateTime, nullable=True, default=datetime.datetime.utcnow)

    def get_user_id(self):
        return self.id


class Email(Model):
    __tablename__ = "email"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, index=True, nullable=False)
    primary = Column(Boolean, default=False)
    verified = Column(Boolean, default=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete="CASCADE") )


class AccessToken(Model):
    __tablename__ = "access_token"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider = Column(String, nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete="CASCADE"))
    access_token_encrypted = Column(LargeBinary, nullable=False)
    expires_at = Column(DateTime, nullable=True)


class RefreshToken(Model):
    __tablename__ = "refresh_token"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider = Column(String, nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete="CASCADE"))
    refresh_token_encrypted = Column(LargeBinary, nullable=False)
    expires_at = Column(DateTime, nullable=True)


class OAuth2Client(Model, OAuth2ClientMixin):
    __tablename__ = 'oauth2_client'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID, ForeignKey('user.id', ondelete='CASCADE')
    )
    user = relationship('User')


class OAuth2Token(Model, OAuth2TokenMixin):
    __tablename__ = 'oauth2_token'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID, ForeignKey('user.id', ondelete='CASCADE')
    )
    user = relationship('User')

    def is_refresh_token_active(self):
        if self.revoked:
            return False
        expires_at = self.issued_at + self.expires_in * 2
        return expires_at >= time.time()


class OAuth2AuthorizationCode(Model, OAuth2AuthorizationCodeMixin):
    __tablename__ = 'oauth2_authorization_code'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID, ForeignKey('user.id', ondelete='CASCADE')
    )
    user = relationship('User')

