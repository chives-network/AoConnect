// ** React Imports
import { Fragment, useState, useEffect, SetStateAction } from 'react'

import JSONViewer from 'react-json-viewer';

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import CardMedia from '@mui/material/CardMedia'

//PDF
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

//EXCEL
import {OutTable, ExcelRenderer} from 'react-excel-renderer';

import dynamic from 'next/dynamic';

type FileViewerProps = {
  fileType: string
  filePath: string
  className: string
};

const FileViewer: React.ComponentType<FileViewerProps> = dynamic(
  () => import('react-file-viewer') as Promise<React.ComponentType<FileViewerProps>>,
  { ssr: false }
);


// Set up pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import styles from './Excel2007.module.css';

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

function ExcelViewer({ fileUrl }: { fileUrl: string; } ) {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onload = () => {
          ExcelRenderer(blob, (err: any, resp: { cols: SetStateAction<never[]>; rows: SetStateAction<never[]> }) => {
            if (err) {
              console.error(err);
            } else {
              const tempCols: SetStateAction<any[]> = []
              tempCols.push({name: '', key: 0})
              
              // @ts-ignore
              resp && resp.cols && resp.cols.map((Item: {'name': string, 'key': number}, Index: number)=>{
                if(Item.name) {
                  tempCols.push({name: Item.name, key: Index+1})
                }
              })
              
              // @ts-ignore
              setCols(tempCols);
              
              // @ts-ignore
              setRows(resp.rows);
            }
          });
        };
        
        reader.onerror = () => {
          throw new Error("Failed to read the blob data");
        };
        
        reader.readAsBinaryString(blob);
      } catch (error) {
        console.error("Error fetching or parsing the Excel file:", error);
      }
    };

    fetchExcel();
  }, [fileUrl]);

  return (
      <div>
        {rows && cols && (
          <OutTable
            data={rows}
            columns={cols}
            tableClassName={styles.ExcelTable2007}
            tableHeaderRowClass={styles.heading}
          />
        )}
      </div>
  );
}

/*
function PPTXViewer({ fileUrl }: { fileUrl: string }) {
  const [presentationData, setPresentationData] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndDisplayPresentation = async () => {
      try {
        const response = await fetch(fileUrl);
        const data = await response.arrayBuffer();
        const base64Data = btoa(new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        setPresentationData(base64Data);
      } catch (error) {
        console.error('Error fetching presentation:', error);
      }
    };

    fetchAndDisplayPresentation();
  }, [fileUrl]);

  if (!presentationData) {
    return <div>Loading...</div>;
  }

  return <Presentation data={`data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${presentationData}`} />;
}
*/

interface ImagesPreviewType {
    open: boolean
    imagesList: string[]
    imagesType: string[]
    toggleImagesPreviewDrawer: () => void
  }

const ImagesPreview = (props: ImagesPreviewType) => {
  // ** Props
  const { imagesList, imagesType } = props
  
  const [numPages, setNumPages] = useState<number>(0)    
  function onDocumentLoadSuccess({ numPages }: { numPages: number; } ) {
      setNumPages(numPages);
  }

  // ** States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // ** Hook
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    rtl: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    }
  })

  const [jsonData, setJsonData] = useState(null);
  useEffect(() => {
    if(imagesType[0] == 'json' && imagesList[0] != '') {
        fetch(imagesList[0])
        .then((response) => response.json())
        .then((data) => {
            setJsonData(data);
        })
        .catch((error) => {
            console.error('Error fetching JSON data:', error);
        });
    }
  }, [imagesList, imagesType]);

  console.log("imagesList", imagesList)

  return (
          <Fragment>
            <Box className='navigation-wrapper'>
                <Box ref={sliderRef} className='keen-slider' style={{'width':'820px'}}>
                {imagesList && imagesList.length>0 && imagesList.map((Url: string, UrlIndex: number)=>{
                  console.log("Url", Url)
                  switch(imagesType[UrlIndex]) {
                    case 'image':
                      
                    return (
                          <Box className='keen-slider__slide' key={UrlIndex}>
                              <img src={Url} style={{'width':'100%', 'borderRadius': '4px'}}/>
                          </Box>
                      )
                    case 'pdf':
                      
                      return (
                          <Fragment key={UrlIndex}>
                              <Document file={Url} onLoadSuccess={onDocumentLoadSuccess} >
                                  {Array.from(new Array(numPages), (element, index) => {
                                      
                                      return (<Page key={`page_${index + 1}`} pageNumber={index + 1} width={820}/>)
                                  })}
                              </Document>
                          </Fragment>
                      );
                      case 'DocToPdf':
                        
                        return (
                            <Fragment key={UrlIndex}>
                                <Document file={Url} onLoadSuccess={onDocumentLoadSuccess} >
                                    {Array.from(new Array(numPages), (element, index) => {
                                        
                                        return (<Page key={`page_${index + 1}`} pageNumber={index + 1} width={820}/>)
                                    })}
                                </Document>
                            </Fragment>
                        );
                    case 'json':

                      return (
                        <div style={{ width: '100%', height: '100%', backgroundColor:'white'}} key={UrlIndex}>
                            {jsonData && jsonData!=undefined ?
                                <JSONViewer json={jsonData}/>
                            :
                                <Fragment></Fragment>
                            }
                        </div>
                      )
                    case 'Word':

                      return (
                        <div style={{ width: '100%', color:'black'}} key={UrlIndex}>
                          <FileViewer fileType={'docx'} filePath={Url} className={styles.ExcelTable2007}/>
                        </div>
                      )

                    case 'Excel':
                      
                      return <ExcelViewer fileUrl={Url} />
                    
                    case 'Video':

                      return (
                        <CardMedia component="video" controls src={`${Url}`} sx={{ width:'100%', height:'100%', objectFit: 'contain' }}/>
                      )
                    
                    case 'Audio':

                      return (
                        <CardMedia component="video" controls src={`${Url}`} sx={{ width:'100%', height:'55px', objectFit: 'contain' }}/>
                      )

                    default:
                      
                      return (
                          <Box className='keen-slider__slide' key={UrlIndex}>
                              <img src={Url} style={{'width':'100%', 'borderRadius': '4px'}}/>
                          </Box>
                      )
                  }                    
                })}
                </Box>
                {imagesList && imagesList[0]=="image" && loaded && instanceRef.current && (
                  <Fragment>
                      <Icon
                      icon='mdi:chevron-left'
                      className={clsx('arrow arrow-left', {
                          'arrow-disabled': currentSlide === 0
                      })}
                      onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
                      />
                      <Icon
                      icon='mdi:chevron-right'
                      className={clsx('arrow arrow-right', {
                          'arrow-disabled': currentSlide === instanceRef.current.track.details.slides.length - 1
                      })}
                      onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
                      />
                  </Fragment>
                )}
            </Box>
            {imagesList && imagesList[0]=="image" && loaded && instanceRef.current && (
                <Box className='swiper-dots'>
                {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
                    
                    return (
                      <Badge
                          key={idx}
                          variant='dot'
                          component='div'
                          className={clsx({
                          active: currentSlide === idx
                          })}
                          onClick={() => {
                          instanceRef.current?.moveToIdx(idx)
                          }}
                      ></Badge>
                    )
                })}
                </Box>
            )}
          </Fragment>
    
  )
}

export default ImagesPreview
