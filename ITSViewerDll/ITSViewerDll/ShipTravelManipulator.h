#pragma once
#include "Common.h"

class ShipTravelManipulator
{
public:
	ShipTravelManipulator(osg::ref_ptr<osg::MatrixTransform> shipMT);
	~ShipTravelManipulator();

private:
	float m_shipVec = 0.0f;
	float m_shipAngleVec = 0.0f;
	float m_shipRotation;
	osg::Vec3f m_shipPosotion;
	osg::ref_ptr<osg::MatrixTransform> ShipMT;

	float deltaVec = 1.0f;
	float deltaAngleVec = 0.05 / osg::PI;


public:
	void VecSpeedUp();
	void AngleVecSpeedUp();
	void ReduceVec();
	void ReduceAngleVec();
	void Move();
	osg::Vec3f GetShipPosition();
	float GetShipRotation();
};

