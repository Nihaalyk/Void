# app/crud.py
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas

async def create_extracted_data(session: AsyncSession, data: schemas.ExtractedDataSchema):
    db_data = models.ExtractedData(
        file_type=data.file_type,
        file_name=data.file_name,
        extracted_content=data.extracted_content
    )
    session.add(db_data)
    await session.commit()
    await session.refresh(db_data)
    return db_data

async def get_extracted_data(session: AsyncSession, data_id: int):
    result = await session.execute(select(models.ExtractedData).where(models.ExtractedData.id == data_id))
    return result.scalars().first()
