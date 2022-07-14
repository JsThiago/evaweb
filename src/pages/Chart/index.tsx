import { Box, Paper, Switch } from "@mui/material";
import React,{useEffect, useRef, useState} from "react";
import TwoSameArea from "../../components/Chart";
import TwoCharts from "../../components/TwoChart";
import { ButtonBase } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowFoward from "@mui/icons-material/ArrowForward";
import RadioButton from "../../components/RadioButton";
import BotoesOp from "../../components/BotoesOp";
import "./styles.css";
import {getDados} from "../../api/dadosDestilacao"
export default function Chart() {
	const [data,setData] = useState<any>([{}])
	const [dateString,setDateString] = useState<string>('')
	const dados = useRef<Record<string,any>>({})
	const [media_temp,setMedia_temp] = useState<string>()
	const [media_gl,setMedia_gl] = useState<string>()
	const [media_litros,setMedia_litros] = useState<string>()
	const id = useRef<number|undefined|null>();
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		id.current = params.get("id") !== null ? Number(params.get("id")):-1;
		async function getDadosAsync(){
			dados.current =  await getDados(id.current);
			setData(dados.current._pontosCabeca);
			setMedia_gl(dados.current.mediaCabeca.gl);
			setMedia_temp(dados.current.mediaCabeca.temp);
			setMedia_litros(dados.current.mediaCabeca.litros)
		}
		setDateString(params.get("data")||'');
		getDadosAsync();
	}, []);
	const handlerChangePart = function(part:string){
		if(part === "cabeca"){
			setMedia_gl(dados.current.mediaCabeca.gl);
			setMedia_temp(dados.current.mediaCabeca.temp);
			setMedia_litros(dados.current.mediaCabeca.litros)
			setData(dados.current._pontosCabeca)
		}else if(part === "coracao"){

			setMedia_gl(dados.current.mediaCoracao.gl);
			setMedia_temp(dados.current.mediaCoracao.temp);
			setMedia_litros(dados.current.mediaCoracao.litros)
			setData(dados.current._pontosCoracao)
		}else if(part === "cauda"){

			setMedia_gl(dados.current.mediaCauda.gl);
			setMedia_temp(dados.current.mediaCauda.temp);
			setMedia_litros(dados.current.mediaCauda.litros)
			setData(dados.current._pontosCauda)
		}else{
			setMedia_gl(dados.current.mediaTodos.gl);
			setMedia_temp(dados.current.mediaTodos.temp);
			setMedia_litros(dados.current.mediaTodos.litros)

			setData([...dados.current._pontosCabeca,...dados.current._pontosCauda,...dados.current._pontosCoracao])
		}

	}
	const [checked, setChecked] = React.useState(false);

	const [expandir, setExpandir] = React.useState(false);
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box
				className="title-charts-page"
			>
				<h1>Destilação do dia: {dateString}</h1>
			</Box>

			<Box sx={{ display: "flex", marginBottom: 10 }}>
				<Paper sx={{ marginRight: 10, padding: 5 }}>
					<h3>Valor médio da temperatura: {media_temp} C</h3>
				</Paper>
				<Paper sx={{ padding: 5, marginRight: 10 }}>
					<h3>Valor médio do GL:{media_gl} C</h3>
				</Paper>
				<Paper sx={{ padding: 5 }}>
					<h3>Litros totais: {media_litros} L</h3>
				</Paper>
			</Box>

			<Box className="chart-warp">
				{checked ? <TwoCharts compacto={!expandir} data={data} /> : <TwoSameArea compacto={!expandir} data={data}/>}
			</Box>
			<Box
				className="options-warp-chart"
			>
				<Box
					sx={{
						display: "flex",
					}}
				>
					<RadioButton handlerChange={handlerChangePart} />
					<div className="options-buttons-chart">
						<BotoesOp data={dateString} id={id.current} />
					</div>
				</Box>
				<Box
					className="switch-charts-warp"
				>
					<b className="switch-charts-text">Dividir em dois gráficos</b>
					<Switch
						onClick={() => {
							setChecked(!checked);
						}}
						checked={checked}
						size="medium"
					/>
				</Box>

				<Box
					className="switch-charts-warp"
				>
					<b className="switch-charts-text">Expandir gráfico</b>
					<Switch
						onClick={() => {
							setExpandir(!expandir);
						}}
						checked={expandir}
						size="medium"
					/>
				</Box>
				<Box
					className="options-pagination"
				>
					{
						/*
						<ButtonBase>
							<ArrowBack />
	    Voltar
    </ButtonBase>
    <ButtonBase>
	    Proxima
	    <ArrowFoward />
    </ButtonBase>
						 */
					}
				</Box>
			</Box>
		</Box>
	);
}
